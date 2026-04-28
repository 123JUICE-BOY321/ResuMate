import React, { useEffect, useRef } from 'react';

const Paper3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, model, animationId;
    let isMounted = true;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const init = () => {
      if (!mountRef.current || !isMounted) return;

      scene = new window.THREE.Scene();
      camera = new window.THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 1.5);

      renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      renderer.outputEncoding = window.THREE.sRGBEncoding;
      renderer.toneMapping = window.THREE.ACESFilmicToneMapping;
      
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directLight = new window.THREE.DirectionalLight(0xffffff, 1.0);
      directLight.position.set(0, 0, 10);
      scene.add(directLight);

      const loader = new window.THREE.GLTFLoader();
      loader.load('https://files.catbox.moe/pjnl9i.glb', (gltf) => {
        if (!isMounted) return;
        model = gltf.scene;
        
        const box = new window.THREE.Box3().setFromObject(model);
        const size = box.getSize(new window.THREE.Vector3()).length();
        const center = box.getCenter(new window.THREE.Vector3());

        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y)-0.1;
        model.position.z += (model.position.z - center.z);

        // Slightly reduced to leave room for rotation without clipping canvas edges
        const desiredSize = 1.0; 
        model.scale.multiplyScalar(desiredSize / size);

        const rotX_degrees = 0; 
        const rotY_degrees = 120;
        const rotZ_degrees = 90;  

        const initialRotX = window.THREE.MathUtils.degToRad(rotX_degrees);
        const initialRotY = window.THREE.MathUtils.degToRad(rotY_degrees);
        const initialRotZ = window.THREE.MathUtils.degToRad(rotZ_degrees);
        
        model.rotation.set(initialRotX, initialRotY, initialRotZ);
        model.userData.baseRotX = initialRotX;
        model.userData.baseRotY = initialRotY;

        scene.add(model);
      });

      const handleMouseMove = (event) => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove);
      mountRef.current._handleMouseMove = handleMouseMove;

      const handleResize = () => {
        if (!mountRef.current || !isMounted) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      };
      window.addEventListener('resize', handleResize);
      mountRef.current._handleResize = handleResize;

      const animate = () => {
        if (!isMounted) return;
        animationId = requestAnimationFrame(animate);
        
        if (model && model.userData.baseRotX !== undefined) {
          // INCREASED SENSITIVITY FOR 3D MODEL ROTATION
          const sensitivityX = 0.4; // Up from 0.05
          const sensitivityY = 0.2; // Up from 0.03

          targetRotationY = model.userData.baseRotY + (mouseX * sensitivityX); 
          targetRotationX = model.userData.baseRotX - (mouseY * sensitivityY);

          model.rotation.y += (targetRotationY - model.rotation.y) * 0.1; // Increased easing speed
          model.rotation.x += (targetRotationX - model.rotation.x) * 0.1;
        }

        renderer.render(scene, camera);
      };
      animate();
    };

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const setupThree = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        while(!window.THREE) await new Promise(r => setTimeout(r, 50));
        await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
        while(!window.THREE.GLTFLoader) await new Promise(r => setTimeout(r, 50));
        init();
      } catch (err) { console.error(err); }
    };

    setupThree();

    return () => {
      isMounted = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (mountRef.current && mountRef.current._handleResize) window.removeEventListener('resize', mountRef.current._handleResize);
      if (mountRef.current && mountRef.current._handleMouseMove) window.removeEventListener('mousemove', mountRef.current._handleMouseMove);
      if (mountRef.current && renderer) mountRef.current.removeChild(renderer.domElement);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full relative z-10" style={{ perspective: "1000px" }} />;
};

export default Paper3D;

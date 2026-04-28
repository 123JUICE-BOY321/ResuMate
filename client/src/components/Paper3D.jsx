import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Paper3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let model, animationId;
    let mouseX = 0, mouseY = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 1.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directLight.position.set(0, 0, 10);
    scene.add(directLight);

    const loader = new GLTFLoader();
    loader.load('/Paper.glb', (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      model.position.set(-center.x, -center.y - 0.1, -center.z);
      model.scale.multiplyScalar(1.0 / size);
      model.rotation.set(0, THREE.MathUtils.degToRad(120), THREE.MathUtils.degToRad(90));

      model.userData.baseRotX = model.rotation.x;
      model.userData.baseRotY = model.rotation.y;
      scene.add(model);
    });

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (model?.userData.baseRotX !== undefined) {
        const targetX = model.userData.baseRotX - (mouseY * 0.2);
        const targetY = model.userData.baseRotY + (mouseX * 0.4);
        model.rotation.x += (targetX - model.rotation.x) * 0.1;
        model.rotation.y += (targetY - model.rotation.y) * 0.1;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full relative z-10" />;
};

export default Paper3D;
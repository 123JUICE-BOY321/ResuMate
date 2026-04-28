import DotField from './DotField'; // Make sure this path matches your filename exactly

const Background = () => {
    return (
        <div className="fixed inset-0 z-0 w-full h-full bg-gradient-to-b from-slate-900 to-black">
            <DotField
                dotRadius={1.5}
                dotSpacing={40}
                bulgeStrength={40}
                glowRadius={0}
                cursorRadius={500}
                bulgeOnly
                gradientFrom="#0284c7" // Sky-600
                gradientTo="#1e3a8a"   // Blue-900
            />
        </div>
    );
};

export default Background;
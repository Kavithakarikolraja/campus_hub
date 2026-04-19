import { useEffect, useState } from 'react';

const CursorGlow = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
                background: `radial-gradient(circle 400px at ${position.x}px ${position.y}px, rgba(249, 115, 22, 0.15), transparent 80%)`,
                transition: 'background 0.15s ease-out',
            }}
        />
    );
};

export default CursorGlow;


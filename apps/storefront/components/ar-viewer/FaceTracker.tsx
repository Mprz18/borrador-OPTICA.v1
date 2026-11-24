"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Componente del armazón 3D (Recibirá las coordenadas biométricas)
function GlassesModel() {
  const glassesRef = useRef<THREE.Group>(null);

  // Bucle de renderizado a 60FPS. 
  // Aquí inyectaremos los datos de posición (x, y, z, pitch, yaw, roll) de MediaPipe.
  useFrame((state) => {
    if (!glassesRef.current) return;
    // Animación de flotación simulada mientras no hay tracking activo
    glassesRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
    glassesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={glassesRef} scale={[0.15, 0.15, 0.15]}>
      {/* Micas Médicas (Simulación de Alto Índice) */}
      <mesh position={[-1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.05, 64]} />
        <meshPhysicalMaterial 
          transmission={1} 
          opacity={1} 
          roughness={0} 
          ior={1.67} // Índice de refracción real de la mica
          thickness={0.2}
          clearcoat={1}
        />
      </mesh>
      <mesh position={[1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.05, 64]} />
        <meshPhysicalMaterial 
          transmission={1} 
          opacity={1} 
          roughness={0} 
          ior={1.67}
          thickness={0.2}
          clearcoat={1}
        />
      </mesh>
      
      {/* Puente del armazón (Titanio/Oro) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshStandardMaterial color="#C2A878" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function FaceMeshOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <Canvas camera={{ position: [0, 0, 2], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        
        {/* Reflejos de entorno para el lujo visual */}
        <Environment preset="studio" />
        
        <GlassesModel />
        
        {/* Sombras de contacto suaves sobre el rostro */}
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.4} 
          scale={5} 
          blur={2.5} 
          far={2} 
        />
      </Canvas>
    </div>
  );
}
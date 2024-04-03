"use client";

import React, { useRef, useState } from "react";
import { extend } from "@react-three/fiber";
import { Canvas, useFrame } from "react-three-fiber";
//VRCanvas is a special canvas that sets up the VR environment
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import * as THREE from "three";

function Box(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
    }
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

interface VRExperienceProps {
  scaleX: number;
  scaleY: number;
}

const VRExperience: React.FC = () => {
  return (
    <>
      
      <Canvas
        camera={{ position: [0, 0, 15] }}
        onCreated={({ gl }: { gl: THREE.WebGLRenderer }) => {
          gl.setClearColor("cyan");
        }}
      >
        <XR>
          <Controllers />
          <Hands />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </XR>
      </Canvas>
    </>
  );
};

export default VRExperience;

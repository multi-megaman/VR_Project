"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import * as THREE from "three";
import Object3D from "@/app/components/Object3D";

import { BonnieSphere, ChicaCube, Floor, VisiblePointLight } from "./Objects";

interface VRExperienceProps {
  scaleX: number;
  scaleY: number;
}

const VRExperience: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 0] }}
      onCreated={({ gl }: { gl: THREE.WebGLRenderer }) => {
        gl.setClearColor("gray");
      }}
    >
      <Suspense>
        <XR>
          
          <Controllers />
          <Hands />

          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />

          {/* The Object3D here represents the whole scene */}
          <Object3D> 
            <VisiblePointLight position={[1.2, 4, -3]} />
            <Floor/>
            <ChicaCube/>
            <BonnieSphere/>
          </Object3D>

        </XR>
      </Suspense>
    </Canvas>
  );
};

export default VRExperience;

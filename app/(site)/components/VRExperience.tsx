"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import * as THREE from "three";
import Object3D from "@/app/components/Object3D";

import { Cube, Floor, Table, VisiblePointLight } from "./Objects";

import { Physics } from "@react-three/cannon";
import repTex from "@/app/components/RepTex";
import TexRep from "@/app/components/RepTex";
import Robot from "./robot1";

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
      <Physics>
        <Suspense>
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

            {/* The Object3D here represents the whole scene */}
            {/* <Object3D> */}
            <Floor />
            {/* <Cube args={[3, 3, 3]} position={[0, 4, -6]} />
            <Cube args={[2, 2, 2]} position={[0, 8, -6.8]} /> */}
            <Robot>
              <Cube args={[0.75, 0.75, 0.75]} position={[0, 4, -3]} textureUrl="robot.webp"/>
            </Robot>
            
            <Table position={[0, 0, -4]} />
            {/* </Object3D> */}
          </XR>
        </Suspense>
      </Physics>
    </Canvas>
  );
};

export default VRExperience;

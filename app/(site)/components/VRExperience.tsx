"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import * as THREE from "three";
import Object3D from "@/app/components/Object3D";

import { Cube, Floor, Table, VisiblePointLight, Wall } from "./Objects";

import { Physics } from "@react-three/cannon";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Robot from "./robot1";

interface VRExperienceProps {
  scaleX: number;
  scaleY: number;
}

const VRExperience: React.FC = () => {
  const { scene } = useLoader(GLTFLoader, "models/ambient1/scene.glb");

  const ambient = useMemo(() => {
      const clonedScene = scene.clone();
      clonedScene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
              node.castShadow = true;
              node.receiveShadow = true;
          }
      });
      return clonedScene;
  }, [scene]);

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
              position={[0, 50, 4]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI/3}
            />

            <primitive object={ambient} scale={2.5} rotation={[0,Math.PI / 2,0]} position={[0,0,-1.2]}/>
            <Floor position={[0,-0.5,0]} visible={false}/>
            <Floor position={[0, 10, 0]} visible={false}/>
            <Wall position={[0, 0, -10]} args={[20, 20, 1]} visible={false}/>
            <Wall position={[0, 0, 10]} args={[20, 20, 1]} visible={false}/>
            <Wall position={[-10, 0, 0]} args={[1, 20, 20]} visible={false}/>
            <Wall position={[10, 0, 0]} args={[1, 20, 20]} visible={false}/>
            {/* <Cube args={[3, 3, 3]} position={[0, 4, -6]} />
            <Cube args={[2, 2, 2]} position={[0, 8, -6.8]} /> */}
            <Robot position={[0,3,-1.2]}/>
            
            <Table args={[5.2,2.25,1.3]} position={[0, 0, -1.2]} visible={false}/>
            {/* </Object3D> */}
          </XR>
        </Suspense>
      </Physics>
    </Canvas>
  );
};

export default VRExperience;

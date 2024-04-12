import Object3D from "@/app/components/Object3D";
import repTex from "@/app/components/repTex";
import { Vector3 } from "react-three-fiber";
import * as THREE from "three"; // Import the 'three' package

export function Floor() {
  return (
    <Object3D position={[0, -1, 0]} repTex={repTex(4,4)}>
      <boxGeometry args={[20, 1, 20]} />
    </Object3D>
  );
}

export function ChicaCube() {
  return (
    <Object3D position={[1.2, 2, -3]} textureUrl="chica.webp">
      <boxGeometry args={[1, 1, 1]} />
    </Object3D>
  );
}

export function BonnieSphere() {
  return (
    <Object3D position={[-1.2, 2, -3]} textureUrl="bonnie.jpg"  repTex={repTex(2,2)} rotation={[1,0.2,0]}>
      <sphereGeometry args={[0.7, 10, 10]} />
    </Object3D>
  );
}

interface LightProps {
    position: number[];
}
export function VisiblePointLight({ position }: LightProps) {
    const pos = new THREE.Vector3(...position);
    return (
      <Object3D position={pos}>
        <pointLight decay={0} intensity={Math.PI/2} position={pos}/>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="yellow" />
      </Object3D>
    );
  }

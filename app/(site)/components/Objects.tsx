import Object3D from "@/app/components/Object3D";
import repTex from "@/app/components/repTex";
import { Vector3 } from "react-three-fiber";
import * as THREE from "three"; // Import the 'three' package

export function Floor() {
  return (
    <Object3D
      position={[0, -1, 0]}
      repTex={repTex(4, 4)}
      objArgs={[20, 1, 20]}
      unaffected
    >
      <boxGeometry args={[20, 1, 20]} />
    </Object3D>
  );
}

export function Cube({ ...props }) {
  return (
    <Object3D
      position={[1.2, 3, -3]}
      textureUrl="chica.webp"
      objArgs={[1, 1, 1]}
      {...props}
    >
      <boxGeometry args={[1, 1, 1]} />
    </Object3D>
  );
}


interface LightProps {
  position: number[];
}
export function VisiblePointLight({ position }: LightProps, { ...props }) {
  const pos = new THREE.Vector3(...position);
  return (
    <Object3D position={[0, 2, -3]} objArgs={[20, 1, 20]}>
      <pointLight decay={0} intensity={Math.PI / 2} position={pos} {...props} />
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color="yellow" />
    </Object3D>
  );
}

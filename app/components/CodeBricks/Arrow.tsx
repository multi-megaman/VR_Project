import React, { useMemo } from "react";
import { MeshProps, useLoader } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial } from "three";

export interface ArrowProps extends MeshProps {
    position: [number, number, number];
}

const Arrow: React.FC<ArrowProps> = ({
    position = [0, 0, 0],
    ...props
}) => {
    const { scene } = useLoader(GLTFLoader, "models/arrow/scene.gltf");
    const model = useMemo(() => {
        const clonedScene = scene.clone();
        clonedScene.traverse((node) => {
            if (node instanceof Mesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        return clonedScene;
    }, [scene]);

    return (
        <mesh {...props} position={position}>
            <primitive
                object={model}
                scale={0.25}
                rotation={[0, Math.PI / 2, 0]}
            />
        </mesh>
    );
};

export default Arrow;

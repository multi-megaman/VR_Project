import React, { useMemo } from "react";
import { MeshProps, useLoader } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial } from "three";

export interface ArrowProps extends MeshProps {
    position: [number, number, number];
}

const Arrow: React.FC<ArrowProps> = ({ position = [0, 0, 0], ...props }) => {
    const { scene } = useLoader(GLTFLoader, "models/arrow/scene.glb");
    // const { scene: frame } = useLoader(GLTFLoader, "models/arrow/frame.glb");
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

    // const frameModel = useMemo(() => {
    //     const clonedScene = frame.clone();
    //     clonedScene.traverse((node) => {
    //         if (node instanceof Mesh) {
    //             node.material = new MeshStandardMaterial({ color: "black" });
    //             node.castShadow = true;
    //             node.receiveShadow = true;
    //         }
    //     });
    //     return clonedScene;
    // }, [frame]);

    return (
        <mesh {...props} position={position}>
            <primitive
                object={model}
                scale={0.25}
                rotation={[0, Math.PI / 2, 0]}
            />
            {/* <primitive
                object={frameModel}
                scale={0.25}
                rotation={[0, Math.PI / 2, 0]}
            /> */}
        </mesh>
    );
};

export default Arrow;

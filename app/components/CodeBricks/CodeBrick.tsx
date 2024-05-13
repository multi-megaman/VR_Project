import React, { useMemo } from "react";
import { MeshProps, useLoader } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial } from "three";

export interface CodeBrickProps extends MeshProps {
    color: string;
    label: string;
    activated?: boolean;
    input?: any;
    execute: (input:any) => void;
}

const CodeBrick: React.FC<CodeBrickProps> = ({
    color,
    label,
    activated = false,
    input,
    execute,
    ...props
}) => {
    const { scene } = useLoader(GLTFLoader, "models/codeBrick/scene.glb");
    const model = useMemo(() => {
        const clonedScene = scene.clone();
        clonedScene.traverse((node) => {
            if (node instanceof Mesh && node.material.name !== "OH_Outline_Material") {
              node.material = new MeshStandardMaterial({ color });
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
        return clonedScene;
    }, [scene]);


    return (
        <mesh {...props}>
            <primitive
                object={model}
                scale={0.25}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Text
                position={[0, 0, 0.11]}
                fontSize={0.05}
                color={"black"}
            >
                {label}
            </Text>
        </mesh>
    );
};

export default CodeBrick;

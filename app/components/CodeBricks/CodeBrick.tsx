import React, { MutableRefObject, RefObject, useMemo } from "react";
import { MeshProps, useLoader } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial, Object3D, Object3DEventMap, Vector3 } from "three";
import { PublicApi, Triplet } from "@react-three/cannon";

export interface CodeBrickProps extends MeshProps {
    color: string;
    label: string;
    activated?: boolean;
    input?: any;
    execute: (input:any, api:PublicApi, ref:MutableRefObject<Vector3>) => void;
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
                fontSize={0.07}
                color={"black"}
            >
                {label}{input ? `(${input})` : ""}
            </Text>
        </mesh>
    );
};

export default CodeBrick;

import React, { forwardRef, MutableRefObject, RefObject, useMemo } from "react";
import { MeshProps, useLoader } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial, Object3D, Object3DEventMap, Quaternion, Vector3 } from "three";
import { PublicApi, Triplet } from "@react-three/cannon";

export interface CodeBrickProps extends MeshProps {
    index: number;
    color: string;
    label: string;
    activated?: boolean;
    input?: any;
    execute: (input: any, api: PublicApi, posRef: MutableRefObject<Vector3>, rotRef: MutableRefObject<Quaternion>) => void;
}

const CodeBrick = forwardRef<Mesh, CodeBrickProps>(({
    index,
    color,
    label,
    activated = false,
    input,
    execute,
    ...props
}, ref) => {
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
    }, [scene, color]);

    // Log userData to verify it is being set correctly
    useMemo(() => {
        console.log("Mesh userData:", { id: index });
    }, [index]);
    return (
        <mesh ref={ref} {...props} userData={{"id": index}}>
            <Text
                position={[0, 0, 0.11]}
                fontSize={0.13}
                color={"black"}
                name={"Text"}
                userData={{"id": index}}
            >
                {label}{input ? `(${input})` : ""}
            </Text>
            <primitive
                object={model}
                scale={0.25}
                rotation={[0, Math.PI / 2, 0]}
                userData={{"id": index}}

            />
        </mesh>
    );
});

export default CodeBrick;

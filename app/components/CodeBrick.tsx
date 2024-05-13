import React, { useMemo, useState } from "react";
import { MeshProps, useLoader } from "react-three-fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, MeshStandardMaterial } from "three";

export interface CodeBrickProps extends MeshProps {
    color: string;
    label: string;
    execute: () => void;
}

const CodeBrick: React.FC<CodeBrickProps> = ({
    color,
    label,
    execute,
    ...props
}) => {
    const { scene } = useLoader(GLTFLoader, "models/codeBrick/scene.gltf");
    const [running, setRunning] = useState(false);
    const model = useMemo(() => {
        const clonedScene = scene.clone();
        clonedScene.traverse((node) => {
            if (node instanceof Mesh) {
                node.material = new MeshStandardMaterial({ color });
            }
        });
        return clonedScene;
    }, [scene]);

    function callExecute() {
        setRunning(true);
        execute();
        setTimeout(() => {
            setRunning(false);
        }, 200);
    }
    return (
        <mesh onClick={execute} {...props}>
            <primitive
                object={model}
                scale={0.5}
                rotation={[0, Math.PI / 2, 0]}
            />
            <Text
                position={[0, 0, 0.11]}
                fontSize={0.2}
                color={running ? "white" : "black"}
            >
                {label}
            </Text>
        </mesh>
    );
};

export default CodeBrick;

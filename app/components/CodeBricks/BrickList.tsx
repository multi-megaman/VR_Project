// BrickList.tsx
import React, { Ref, useContext, useEffect, useRef, useState } from "react";
import CodeBrick, { CodeBrickProps } from "./CodeBrick";
import { foward, right } from "./Bricks";
import { useXR } from "@react-three/xr";
import { useFrame, useThree } from "react-three-fiber";
import Arrow from "./Arrow";
import RobotContext from "@/app/context/robotContext";
import {
    Mesh,
    Quaternion,
    Vector3,
} from "three";

const BrickList: React.FC = () => {
    const robot = useContext(RobotContext);
    const [waitTime, setWaitTime] = useState(1000);
    const [brickList, setBrickList] = useState<CodeBrickProps[]>([]);
    const [nextBrickIndex, setNextBrickIndex] = useState(0);
    const [startStop, setStartStop] = useState(false);
    const { controllers } = useXR();
    const [buttonPressed, setButtonPressed] = React.useState(false);
    const posRef = useRef(new Vector3(0, 0, 0));
    const rotRef = useRef(new Quaternion(0, 0, 0, 1));

    const groupRef = useRef<Mesh | null>(null); // Create a ref for the group
    const { camera } = useThree(); // Get the camera from the Three.js context

    //make the bricklist aways face the camera
    useFrame(() => {
        if (groupRef.current) {
            // Create a new vector that has the same x and z coordinates as the camera but the same y coordinate as the object
            const lookAtPosition = new Vector3(
                camera.position.x,
                groupRef.current.position.y,
                camera.position.z
            );
            // Make the object look at the new vector
            groupRef.current.position.set(lookAtPosition.x -1.2, lookAtPosition.y, lookAtPosition.z - 1.5)
        }
    });

    // Start/stop execution when button 1 is pressed
    useFrame(() => {
        if (controllers && controllers[0]) {
            const gamepad = controllers[0].inputSource?.gamepad;
            if (gamepad) {
                if (gamepad.buttons[4].pressed && !buttonPressed) {
                    console.log("Button 2 pressed");
                    setStartStop((prev) => !prev);
                    setButtonPressed(true);
                } else if (!gamepad.buttons[4].pressed) {
                    setButtonPressed(false);
                }
            }
        }
    });

    //for test
    useEffect(() => {
        setBrickList([foward,right,foward,right,foward,right,foward,right,]);
    }, []);

    const updateBrickInput = (index: number, input: number) => {
        setBrickList((prevBrickList) => {
            const newBrickList = [...prevBrickList];
            newBrickList[index] = { ...newBrickList[index], input };
            return newBrickList;
        });
    };

    const executeNextBrick = async (brickIndex: number) => {
        // console.log("Executing brick", brickIndex);
        const brick = brickList[brickIndex];
        brick.activated = true;
        brick.execute(brick.input, robot.api, posRef, rotRef);
        brick.activated = false;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        setNextBrickIndex((prev) => prev + 1);
    };

    useEffect(() => {
        // updateBrickInput(0, 20);
        if (startStop && nextBrickIndex < brickList.length) {
            executeNextBrick(nextBrickIndex);
        }
        if (nextBrickIndex === brickList.length) {
            // setStartStop(false);
            setNextBrickIndex(0);
        }
    }, [startStop, nextBrickIndex]);

    return (
        <mesh ref={groupRef}>
            <group position={[0, 1, 0]}>
                {[...brickList].reverse().map((brick, index) => (
                    <CodeBrick
                        key={index}
                        color={brick.color}
                        label={brick.label}
                        activated={brick.activated}
                        execute={brick.execute}
                        position={[0, index / 3.7, 0]} // Stack bricks on top of each other
                    />
                ))}
                <CodeBrick
                    color="white"
                    label="End"
                    activated={false}
                    execute={() => {}}
                    position={[0, -0.27, 0]}
                />
                <Arrow
                    position={[
                        -0.5,
                        (brickList.length - (nextBrickIndex + 1)) / 3.7,
                        0,
                    ]}
                />
            </group>
        </mesh>
    );
};

export default BrickList;

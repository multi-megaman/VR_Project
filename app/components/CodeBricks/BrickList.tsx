// BrickList.tsx
import React, { useEffect, useState } from "react";
import CodeBrick, { CodeBrickProps } from "./CodeBrick";
import { foward, right } from "./Bricks";
import { useXR } from "@react-three/xr";
import { useFrame } from "react-three-fiber";
import Arrow from "./Arrow";
const BrickList: React.FC = () => {
    const [waitTime, setWaitTime] = useState(2000);
    const [brickList, setBrickList] = useState<CodeBrickProps[]>([]);
    const [nextBrickIndex, setNextBrickIndex] = useState(0);
    const [startStop, setStartStop] = useState(false);
    const { controllers } = useXR();
    const [buttonPressed, setButtonPressed] = React.useState(false);

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
        setBrickList([foward, right, foward, foward, foward, right]);
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
        brick.execute(brick.input);
        brick.activated = false;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        setNextBrickIndex((prev) => prev + 1);
    };

    useEffect(() => {
        // updateBrickInput(0, 20);
        if (startStop && nextBrickIndex < brickList.length) {
            executeNextBrick(nextBrickIndex);
        }
    }, [startStop, nextBrickIndex]);

    return (
        <group position={[0, 1.25, 0]}>

            {[...brickList].reverse().map((brick, index) => (
                <CodeBrick
                    key={index}
                    color={brick.color}
                    label={brick.label}
                    activated={brick.activated}
                    execute={brick.execute}
                    position={[0, index / 4, 0]} // Stack bricks on top of each other
                />
            ))}
            <CodeBrick
                color="white"
                label="End"
                activated={false}
                execute={() => {}}
                position={[0, -0.25, 0]}
            />
            <Arrow
                position={[
                    -0.5,
                    (brickList.length - (nextBrickIndex + 1)) / 4,
                    0,
                ]}
            />
        </group>
    );
};

export default BrickList;

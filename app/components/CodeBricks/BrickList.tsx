// BrickList.tsx
import React, { Ref, useContext, useEffect, useRef, useState } from "react";
import CodeBrick, { CodeBrickProps } from "./CodeBrick";
import { backward, foward, jump, left, right } from "./Bricks";
import { useController, useXR } from "@react-three/xr";
import { useFrame, useThree } from "react-three-fiber";
import Arrow from "./Arrow";
import RobotContext from "@/app/context/robotContext";
import { Mesh, Quaternion, Raycaster, Vector3 } from "three";
import { useBrickList } from "@/app/context/brickListContext";

const BrickList: React.FC = () => {
    const robot = useContext(RobotContext);
    const scale = 0.15;
    const [waitTime, setWaitTime] = useState(1000);
    const { brickList, setBrickList, 
            addCodeBrick, brick2Swap, 
            setBrick2Swap, swapBricks,
            startStop, setStartStop } = useBrickList();
    const [nextBrickIndex, setNextBrickIndex] = useState(0);
    const { controllers } = useXR();
    const [buttonPressed, setButtonPressed] = React.useState(false);
    const posRef = useRef(new Vector3(0, 0, 0));
    const rotRef = useRef(new Quaternion(0, 0, 0, 1));
    const [listOnCamera, setListOnCamera] = useState(true);

    const brickRefs = useRef<(Mesh | null)[]>([]);
    const [previousIntersectedBrick, setPreviousIntersectedBrick] = useState<Mesh | null>(null);

    const rightController = useController('right');
    const raycaster = new Raycaster();

    const groupRef = useRef<Mesh | null>(null); // Create a ref for the group
    const { camera } = useThree(); // Get the camera from the Three.js context
    const [buttonLock, setButtonLock] = useState(false);
    const [buttonLock2, setButtonLock2] = useState(false);

    //make the bricklist aways face the camera and postiion the bricklist in front of the camera or controller
    useFrame(() => {
        if (groupRef.current) {
            if (controllers && controllers[1]) {
                const controller = controllers[1];
                const controllerPosition = new Vector3();
                controller.controller.getWorldPosition(controllerPosition);
                if (!listOnCamera) { 
                    groupRef.current.position.set(
                        controllerPosition.x,
                        controllerPosition.y + (((brickList.length * scale ** 4) / (3.7 ))) - 0.01, // Adjust the y-coordinate here
                        controllerPosition.z
                    );
                }
                else {
                    groupRef.current.position.set(camera.position.x-0.5 , camera.position.y, camera.position.z-0.5)
                }
                groupRef.current.lookAt(
                    new Vector3(
                        camera.position.x,
                        groupRef.current.position.y,
                        camera.position.z
                    )
                );
            }
            if (controllers && controllers[1]) {
                const gamepad = controllers[1].inputSource?.gamepad;
                if (gamepad) {
                    if (gamepad.buttons[1].pressed && !buttonLock2) {
                        setButtonLock2(true);
                        console.log("Button 2 pressed");
                        setListOnCamera((prev) => !prev);
                    } 
                    if (gamepad.buttons[1].value === 0) {
                        setButtonLock2(false);
                    }
                }
            }
        }
    });

    // Start/stop execution when button 4 is pressed
    useFrame(() => {
        if (controllers && controllers[0]) {
            const gamepad = controllers[0].inputSource?.gamepad;
            if (gamepad) {
                if (gamepad.buttons[4].pressed && !buttonPressed) {
                    console.log("Button 4 pressed");
                    setStartStop((prev) => !prev);
                    setButtonPressed(true);
                } else if (!gamepad.buttons[4].pressed) {
                    setButtonPressed(false);
                }
            }
        }
    });

    useEffect(() => {
        setBrickList([
            // foward,
            // jump,
            // backward

        ]);
    }, []);

    const executeNextBrick = async (brickIndex: number) => {
        // console.log("Executing brick", brickIndex);
        const brick = brickList[brickIndex];
        brick.activated = true;
        brick.execute(brick.input, robot.api, posRef, rotRef);
        brick.activated = false;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        setNextBrickIndex((prev) => prev + 1);
    };

    // Execute the next brick if the state is in "start" button is pressed
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

    useEffect(() => {
        // Check if there are exactly 2 IDs in Brick2Swap
        if (brick2Swap.length === 2) {
            // If the IDs are the same, reset the list
            if (brick2Swap[0] === brick2Swap[1]) {
                setBrick2Swap([]);
            }
            else {
                const [id1, id2] = brick2Swap;
                swapBricks(id1, id2);
                setBrick2Swap([]);

            }
        }
    }, [brick2Swap]);

    // Interact with the bricks by pointing at them with the controller
    useFrame(() => {
        if (rightController) {
            const controller = controllers[0];
            const controllerPosition = new Vector3();
            const controllerDirection = new Vector3(0, 0, -1); // Pointing forward in the controller's local space

            const gamepad = controller.inputSource?.gamepad;


            // Get the position of the controller
            controller.controller.getWorldPosition(controllerPosition);

            // Transform the direction vector to world space
            controller.controller.localToWorld(controllerDirection);
            controllerDirection.sub(controllerPosition).normalize(); // Subtract the position to get the direction

            // Extend the ray origin a bit more to the back
            const extendedControllerPosition = new Vector3()
                .copy(controllerPosition)
                .sub(controllerDirection.multiplyScalar(1));
            const { grip } = rightController;
            const direction = new Vector3(0, 0, -1).applyQuaternion(grip.quaternion);
            raycaster.set(extendedControllerPosition, controllerDirection);
            const nonNullBrickRefs = brickRefs.current.filter((ref): ref is Mesh => ref !== null);
            const intersects = raycaster.intersectObjects(nonNullBrickRefs);

            if (intersects.length > 0) {
                const intersectedBrick = intersects[0].object as Mesh;
                if (intersectedBrick.name === "Text"){
                    intersectedBrick.scale.set(1.5, 1.5, 1.5);
                    intersectedBrick.parent?.scale.set(1.5, 1.5, 1.5);
                    const intersectedBrickIndex = intersectedBrick.userData.id;
                  
                    // Reset the scale of the previously intersected brick if it's different
                    if (previousIntersectedBrick && previousIntersectedBrick !== intersectedBrick) {
                        previousIntersectedBrick.scale.set(1, 1, 1);
                        previousIntersectedBrick.parent?.scale.set(1, 1, 1);
                    }
    
                    setPreviousIntersectedBrick(intersectedBrick);
                    // Check if the button zero is pressed
                    if (gamepad && gamepad.buttons[5].pressed && intersectedBrickIndex !== undefined && !buttonLock) {
                        setButtonLock(true);
                        console.log("putting brick in swap list", intersectedBrickIndex);
                        setBrick2Swap((prevIds) => {
                            const newIds = [...prevIds];
                            if (newIds.length >= 2) {
                                newIds.shift(); // Remove the oldest ID if there are already 2 IDs
                            }
                            newIds.push(intersectedBrickIndex);
                            return newIds;
                        });
                    }
    
                    if (gamepad && gamepad.buttons[5].value === 0) {
                        setButtonLock(false);
                    }
                }
            

            } else {
                // Reset the scale of the previously intersected brick if there are no intersections
                if (previousIntersectedBrick) {
                    previousIntersectedBrick.scale.set(1, 1, 1);
                    previousIntersectedBrick.parent?.scale.set(1, 1, 1);
                    setPreviousIntersectedBrick(null);
                }
            }
        }
    });

    return (
        <mesh ref={groupRef} scale={scale}>
            <group position={[0, 1, 0]}>
                <CodeBrick
                    index={9999998}
                    color="white"
                    label="Start"
                    activated={false}
                    execute={() => {}}
                    position={[0, brickList.length / 3.7, 0]}
                />
                {[...brickList].reverse().map((brick, index) => (
                    <CodeBrick
                        index={index}
                        key={index}
                        color={brick.color}
                        label={brick.label}
                        activated={brick.activated}
                        execute={brick.execute}
                        position={[0, index / 3.7, 0]} // Stack bricks on top of each other
                        ref={(el: Mesh | null) => {
                            brickRefs.current[index] = el;
                        }}
                        userData={{"id": index}}
                    />
                ))}
                <CodeBrick
                    index={9999999}
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

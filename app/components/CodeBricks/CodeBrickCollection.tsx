import React, { useContext, useRef, useState } from 'react';
import { useBrickList } from "@/app/context/brickListContext";
import CodeBrick, { CodeBrickProps } from '@/app/components/CodeBricks/CodeBrick';
import { backward, foward, jump, left, right } from "./Bricks";
import { Mesh, Raycaster, Vector3 } from 'three';
import { useFrame, useThree } from 'react-three-fiber';
import { useController, useXR } from '@react-three/xr';
import { Text } from "@react-three/drei";

const CodeBrickCollection: React.FC = () => {
    // Calculate the total width of the grid
    const gridWidth = 4 * 1.5 / 2.5; // 4 columns * spacing per column

    const [showCodeBrickCollection, setShowCodeBrickCollection] = useState(false);
    const Codes = [backward, foward, jump, left, right];
    const brickRefs = useRef<(Mesh | null)[]>([]);
    const scale = 0.15;
    const groupRef = useRef<Mesh | null>(null); 
    const { camera } = useThree(); // Get the camera from the Three.js context

    const { controllers } = useXR();
    const [buttonLock, setButtonLock] = useState(false);
    const [buttonLock2, setButtonLock2] = useState(false);
    const leftController = useController('left');
    const raycaster = new Raycaster();
    const [previousIntersectedBrick, setPreviousIntersectedBrick] = useState<Mesh | null>(null);

    const { brickList, setBrickList, 
        addCodeBrick, brick2Swap, 
        setBrick2Swap, swapBricks,
        startStop, setStartStop } = useBrickList();

  const handleAddBrick = (brickProp: CodeBrickProps) => {
    addCodeBrick(brickProp);
  };

    //if the left controller presses button 4, show/hide the code brick collection


    //make the brickcodeCollection aways follows the controller
    useFrame(() => {
        if (groupRef.current) {
            if (controllers && controllers[0]) {
                const controller = controllers[0];
                const controllerPosition = new Vector3();
                controller.controller.getWorldPosition(controllerPosition);
                groupRef.current.position.set(
                    controllerPosition.x,
                    controllerPosition.y + (((brickList.length * scale ** 4) / (3.7 ))) - 0.01, // Adjust the y-coordinate here
                    controllerPosition.z
                );
                groupRef.current.lookAt(
                    new Vector3(
                        camera.position.x,
                        groupRef.current.position.y,
                        camera.position.z
                    )
                );
            }
        }
    });

// Show or hide the code brick collection when the button 4 is pressed
useFrame(() => {
    if (leftController) {
        const controller = controllers[0];
        const controllerPosition = new Vector3();
        const controllerDirection = new Vector3(0, 0, -1); // Pointing forward in the controller's local space

        const gamepad = controller.inputSource?.gamepad;

                // Check if the button 5 is pressed
                if (gamepad && gamepad.buttons[1].pressed && !buttonLock2) {
                    setButtonLock2(true);
                    console.log("showing/hidding the collection");
                    setShowCodeBrickCollection((prev) => !prev);
                }
                if (gamepad && gamepad.buttons[1].value === 0) {
                    setButtonLock2(false);
                }
            }
});

        // Interact with the bricks by pointing at them with the controller
        useFrame(() => {
            if (leftController) {
                const controller = controllers[1];
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
                const { grip } = leftController;
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
                        // Check if the button 5 is pressed
                        if (gamepad && gamepad.buttons[4].pressed && intersectedBrickIndex !== undefined && !buttonLock) {
                            setButtonLock(true);
                            console.log("adding brick to list", intersectedBrickIndex);
                            handleAddBrick(Codes[intersectedBrickIndex]);
                        }
        
                        if (gamepad && gamepad.buttons[4].value === 0) {
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
    <>
    {showCodeBrickCollection && (
        <mesh ref={groupRef} scale={scale}>
            {/* Background rectangle */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[gridWidth + 1, 3.3]} />
                <meshBasicMaterial color="white" transparent opacity={0.5} />
            </mesh>
            {/* Title */}
            <Text
                position={[0, 1.5, 0]} // Adjust the position as needed
                fontSize={0.2} // Adjust the font size as needed
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                Add a Brick!
            </Text>
            <group position={[-gridWidth / 2, 1, 0]}>
                {Codes.map((brick, index) => {
                    const row = Math.floor(index / 4);
                    const col = index % 4;
                    return (
                        <CodeBrick
                            index={index}
                            key={index}
                            color={brick.color}
                            label={brick.label}
                            activated={brick.activated}
                            execute={{} as any}
                            position={[col * 1.5 / 2.5, row * -1.5 / 3.2, 0]} // Adjust spacing as needed
                            ref={(el: Mesh | null) => {
                                brickRefs.current[index] = el;
                            }}
                            userData={{ "id": index }}
                        />
                    );
                })}
            </group>
    </mesh>
    )}
    </>
  );
};

export default CodeBrickCollection;
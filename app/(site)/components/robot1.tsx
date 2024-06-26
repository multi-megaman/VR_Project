import { Mesh, Quaternion, Raycaster, Vector3 } from "three";
import { useBox } from "@react-three/cannon";
import { useXR } from "@react-three/xr";
import { PositionalAudio } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import RobotContext from "@/app/context/robotContext";
import BrickList from "@/app/components/CodeBricks/BrickList";

interface SoundProps {
    url: string;
}
function Sound({ url }: SoundProps) {
    const sound: any = useRef();
    return (
        <Suspense fallback={null}>
            <PositionalAudio autoplay url={url} ref={sound} />
        </Suspense>
    );
}

const Robot = ({ children, ...props }: any) => {
    const { scene } = useLoader(GLTFLoader, "models/robot/scene.glb");

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

    const [holdingCube, setHoldingCube] = useState(false);
    // const arrowHelper = new ArrowHelper(
    //     new Vector3(1, 0, 0),
    //     new Vector3(0, 0, 0),
    //     5,
    //     0xff0000
    // );
    const [ref, api] = useBox(() => ({
        mass: 1,
        position: props.position || [0, 3, -2],
        args: [0.2, 0.2, 0.2],
    }));

    const { controllers, session } = useXR();
    const raycaster = new Raycaster();

    let triggerPressed = false;

    useFrame(() => {
        if (controllers && controllers[0]) {
            const controller = controllers[0];
            const controllerPosition = new Vector3();
            const controllerDirection = new Vector3(0, 0, -1); // Pointing forward in the controller's local space

            const gamepad = controller.inputSource?.gamepad;

            if (gamepad) {
                triggerPressed = gamepad.buttons[0].pressed;
            }

            // Get the position of the controller
            controller.controller.getWorldPosition(controllerPosition);

            // Transform the direction vector to world space
            controller.controller.localToWorld(controllerDirection);
            controllerDirection.sub(controllerPosition).normalize(); // Subtract the position to get the direction

            // Extend the ray origin a bit more to the back
            const extendedControllerPosition = new Vector3()
                .copy(controllerPosition)
                .sub(controllerDirection.multiplyScalar(1));

            // Update the raycaster's origin and direction
            raycaster.set(extendedControllerPosition, controllerDirection);
            // // Update the arrow helper to match the ray
            // arrowHelper.setDirection(raycaster.ray.direction);
            // arrowHelper.position.copy(raycaster.ray.origin);

            const handleCubeInteraction = (
                controller: any,
                triggerPressed: boolean
            ) => {
                if (ref.current) {
                    const intersects = raycaster.intersectObject(
                        ref.current,
                        true
                    );

                    if (
                        (intersects.length > 0 || holdingCube) &&
                        triggerPressed
                    ) {
                        setHoldingCube(true);
                        const controllerPosition = new Vector3();
                        const controllerQuaternion = new Quaternion();
                        controller.controller.getWorldPosition(
                            controllerPosition
                        );
                        controller.controller.getWorldQuaternion(
                            controllerQuaternion
                        );

                        //ADJUSTMENT FOR THE CUBE ROTATION IN COMPARASION TO THE CONTROLLER
                        // Get the current rotation of the cube
                        const cubeQuaternion = ref.current.quaternion;
                        // // Ensure the quaternion of the cube stays close to the quaternion of the controller
                        // if (controllerQuaternion.dot(cubeQuaternion) < 0) {
                        //     controllerQuaternion.set(
                        //         -controllerQuaternion.x,
                        //         -controllerQuaternion.y,
                        //         -controllerQuaternion.z,
                        //         -controllerQuaternion.w
                        //     );
                        // }

                        api.position.set(
                            controllerPosition.x,
                            controllerPosition.y,
                            controllerPosition.z
                        );
                        api.quaternion.set(
                            controllerQuaternion.x,
                            controllerQuaternion.y,
                            controllerQuaternion.z,
                            controllerQuaternion.w
                        );

                        api.velocity.set(0, 0, 0);
                        api.mass.set(0);
                    } else {
                        if (!triggerPressed) {
                            setHoldingCube(false);
                        }
                        api.mass.set(1);
                    }
                }
            };
            handleCubeInteraction(controller, triggerPressed);
        }
    });
    return (
        <RobotContext.Provider value={{ ref, api }}>
            <mesh castShadow receiveShadow>
                {/* <primitive object={arrowHelper} /> */}
                <mesh ref={ref} {...props}>
                    <primitive
                        object={model}
                        scale={0.005}
                        rotation={[0, 0, 0]}
                    />
                    <Sound url="audio/audio.mp3" />
                    {/* <boxGeometry args={[0.5, 0.5, 0.5]} /> */}
                </mesh>
                <BrickList />
            </mesh>
        </RobotContext.Provider>
    );
};

export default Robot;

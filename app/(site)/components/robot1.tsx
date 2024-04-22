import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  ArrowHelper,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Raycaster,
  TextureLoader,
  Vector3,
} from "three";
import { useBox } from "@react-three/cannon";
import { useXR } from "@react-three/xr";
import Object3D from "@/app/components/Object3D";

const Robot = ({ children, ...props }: any) => {
  const arrowHelper = new ArrowHelper(
    new Vector3(1, 0, 0),
    new Vector3(0, 0, 0),
    5,
    0xff0000
  );
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 4, -3],
    args: [0.5, 0.5, 0.5],
  }));
  const { controllers, session } = useXR();
  const raycaster = new Raycaster();

  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("robot.webp");
  const material = new MeshBasicMaterial({ map: texture });

  // let gamepad: Gamepad | null | undefined = null;
  let triggerPressed = false;

  // // Listen to the inputsourceschange event
  // if (session) {
  //   session.addEventListener('inputsourceschange', (event) => {
  //     console.log('inputsourceschange event fired', event);
  //     if (event.added.length > 0) {
  //       gamepad = event.added[0].gamepad;
  //       console.log('gamepad set', gamepad);
  //     }
  //   });
  // }

  useFrame(() => {
    if (controllers && controllers[0]) {
      const controller = controllers[0];
      const controllerPosition = new Vector3();
      const controllerDirection = new Vector3(0, 0, -1); // Pointing forward in the controller's local space
      
      const gamepad = controller.inputSource?.gamepad;

      console.log('useFrame running');
      if (gamepad) {
        triggerPressed = gamepad.buttons[0].pressed;
      }

      // Get the position of the controller
      controller.controller.getWorldPosition(controllerPosition);

      // Transform the direction vector to world space
      controller.controller.localToWorld(controllerDirection);
      controllerDirection.sub(controllerPosition).normalize(); // Subtract the position to get the direction

      // Extend the ray origin a bit more to the back
      const extendedControllerPosition = new Vector3().copy(controllerPosition).sub(controllerDirection.multiplyScalar(1));

      // Update the raycaster's origin and direction
      raycaster.set(extendedControllerPosition, controllerDirection);
      // Update the arrow helper to match the ray
      arrowHelper.setDirection(raycaster.ray.direction);
      arrowHelper.position.copy(raycaster.ray.origin);

      if (ref.current) {
        const intersects = raycaster.intersectObject(ref.current, true);
        if (intersects.length > 0 && triggerPressed) {
      
          // Get the position and rotation of the controller
          const controllerPosition = new Vector3();
          const controllerQuaternion = new Quaternion();
          controller.controller.getWorldPosition(controllerPosition);
          controller.controller.getWorldQuaternion(controllerQuaternion);
      
          // Set the position and rotation of the robot to match the controller
          api.position.set(controllerPosition.x, controllerPosition.y, controllerPosition.z);
          api.rotation.set(controllerQuaternion.x, controllerQuaternion.y, controllerQuaternion.z);
      
          api.velocity.set(0, 0, 0); // Set velocity to zero
          api.mass.set(0); // Set mass to zero
        }
        else {
          api.mass.set(1); // Set mass back to 1
        }
      }
    }
  });

  return (
    <mesh>
      <primitive object={arrowHelper} />
      <mesh ref={ref} {...props}>
        <boxGeometry args={[0.5,0.5,0.5]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
    </mesh>
  );
};

export default Robot;

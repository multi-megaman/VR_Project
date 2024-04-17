import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ArrowHelper, Mesh, Raycaster, Vector3 } from 'three';
import { useBox } from '@react-three/cannon';
import { useXR } from '@react-three/xr';
import Object3D from '@/app/components/Object3D';

const Robot = ({children, ...props}: any) => {
  const arrowHelper = new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 5, 0xff0000);
  const [ref, api] = useBox(() => ({ mass: 1, position: [0, 4, -3], args: [1, 1, 1]}));
  const { controllers } = useXR();
  const raycaster = new Raycaster();

  useFrame(() => {
    if (controllers && controllers[0]) {
      const controller = controllers[0];
      const controllerPosition = new Vector3();
      const controllerDirection = new Vector3();
  
      // Get the position and forward direction of the controller
      controller.controller.getWorldPosition(controllerPosition);
      controller.controller.getWorldDirection(controllerDirection);
  
      // Update the raycaster's origin and direction
      raycaster.set(controllerPosition, controllerDirection);
  
      // Update the arrow helper to match the ray
      arrowHelper.setDirection(raycaster.ray.direction);
      arrowHelper.position.copy(raycaster.ray.origin);
  
      if (ref.current) {
        const intersects = raycaster.intersectObject(ref.current, true);
        // console.log(raycaster.ray.direction, raycaster.ray.origin, intersects.length)
        if (intersects.length > 0) {
          console.log('The VR controller ray intersects the cube');
          api.velocity.set(0, 0, 0); // Set velocity to zero
        }
      }
    }
  });

  return (
    <mesh>

      <primitive object={arrowHelper} />
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
    </mesh>
  );
};

export default Robot;
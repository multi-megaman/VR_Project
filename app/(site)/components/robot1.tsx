import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import Object3D from '@/app/components/Object3D';

const Robot = ({children, ...props}: any) => {
  const meshRef = useRef<Mesh>(null);
  const [direction, setDirection] = useState(1);
  const speed = 0.01;

  useFrame(() => {
    if (meshRef.current) {
      // Move the object
      meshRef.current.position.x += speed * direction;

      // If the object has moved to a certain point, change direction
      if (meshRef.current.position.x > 2) {
        setDirection(-1);
        console.log("Walwing left")
      } else if (meshRef.current.position.x < -2) {
        setDirection(1);
        console.log("Walking right")
      }
    }
  });

  return (
    <Object3D ref={meshRef} {...props}>
      {children}
    </Object3D>
  );
};

export default Robot;
import { MeshProps, useLoader } from '@react-three/fiber';
import { TextureLoader, MeshBasicMaterial, Vector2, RepeatWrapping, MeshPhongMaterial } from 'three';

interface Object3DProps extends MeshProps {
  textureUrl?: string;
  children: React.ReactNode;
  repTex?: Vector2;
}

function Object3D({ textureUrl = 'default.png', repTex = (new Vector2(1, 1)), children, ...rest }: Object3DProps) {
  const texture = useLoader(TextureLoader, textureUrl);

  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.copy(repTex);
  
  const material = new MeshPhongMaterial({ map: texture });
  console.log(repTex)
  return (
    <mesh 
      material={material} 
      {...rest}
      castShadow
      receiveShadow>
      {children}
    </mesh>
  );
}

export default Object3D;
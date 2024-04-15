import { MeshProps, useLoader } from "@react-three/fiber";
import {
  TextureLoader,
  MeshBasicMaterial,
  Vector2,
  RepeatWrapping,
  MeshPhongMaterial,
  Mesh,
  BufferGeometry,
  NormalBufferAttributes,
  Material,
  Object3DEventMap,
  Texture,
  Vector3,
} from "three";
import { useBox } from "@react-three/cannon";
import { useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";

interface Object3DProps extends MeshProps {
  textureUrl?: string;
  children: React.ReactNode;
  repTex?: Vector2;
  objArgs?: [number, number, number];
  unaffected?: boolean;
}

const Object3D = ({
  textureUrl = "default.png",
  repTex = new Vector2(1, 1),
  objArgs = [1, 1, 1],
  unaffected = false,
  children,
  ...rest
}: Object3DProps) => {
  const [texture, setTexture] = useState<Texture | null>(null);
  const [material, setMaterial] = useState<Material | null>(null);

  useEffect(() => {
    var tempTexture = new TextureLoader().load(textureUrl);
    tempTexture.wrapS = RepeatWrapping;
    tempTexture.wrapT = RepeatWrapping;
    tempTexture.repeat.copy(repTex);
    setMaterial(new MeshPhongMaterial({ map: tempTexture }));
    console.log("Texture loaded" + tempTexture.repeat.x);
  }, []);


  const objPos = rest.position as [number, number, number];

  // Define the physics properties
  var [ref, api] = useBox(() => ({
    mass: unaffected ? 0 : 1,
    position: objPos,
    friction: 0,
    args: objArgs,
  }))
  const meshPos = ref?.current?.getWorldPosition(new Vector3()) || new Vector3(0,0,0);
  api.position.set(meshPos.x, meshPos.y, meshPos.z)
  
  return (
    <mesh
      ref={
        ref as React.Ref<
          Mesh<
            BufferGeometry<NormalBufferAttributes>,
            Material | Material[],
            Object3DEventMap
          >
        >
      }
      material={material || undefined}
      {...rest}
      castShadow
      receiveShadow
    >
      {children}
    </mesh>
  );
}

export default Object3D;

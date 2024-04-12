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
} from "three";
import { useBox } from "@react-three/cannon";

interface Object3DProps extends MeshProps {
  textureUrl?: string;
  children: React.ReactNode;
  repTex?: Vector2;
  objArgs?: [number, number, number];
  unaffected?: boolean;
}

function Object3D({
  textureUrl = "default.png",
  repTex = new Vector2(1, 1),
  objArgs = [1, 1, 1],
  unaffected = false,
  children,
  ...rest
}: Object3DProps) {
  const texture = useLoader(TextureLoader, textureUrl);

  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.copy(repTex);

  const material = new MeshPhongMaterial({ map: texture });

  const objPos = rest.position as [number, number, number];

  // Define the physics properties
  var [ref, api] = useBox(() => ({
    mass: unaffected ? 0 : 1,
    position: objPos,
    friction: 0,
    args: objArgs,
  }));

  console.log(repTex);
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
      material={material}
      {...rest}
      castShadow
      receiveShadow
    >
      {children}
    </mesh>
  );
}

export default Object3D;

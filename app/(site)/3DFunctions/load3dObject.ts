import * as THREE from "three";

function load3dObject(
  geometry: THREE.BufferGeometry,
  texturePath: string
): THREE.Mesh {
  const textute = new THREE.TextureLoader().load(texturePath);
  const material = new THREE.MeshBasicMaterial({ map: textute });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.layers.set(2);
  return mesh;
}

export default load3dObject;

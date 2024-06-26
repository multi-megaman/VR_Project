import Object3D from "@/app/components/Object3D";
import repTex from "@/app/components/RepTex";
import * as THREE from "three"; // Import the 'three' package

export function Floor({position = [0, -1, 0] ,visible = true , ...props}) {
    return (
        <Object3D
            textureUrl="floor2.webp"
            position={position as [number, number, number]}
            repTex={repTex(8, 8)}
            objArgs={[20, 1, 20]}
            unaffected
            visible={visible}
        >
            <boxGeometry args={[20, 1, 20]} />
        </Object3D>
    );
}

export function Wall({ position = [0, 0, -10], args = [20, 10, 1] , visible = true,}) {
    return (
        <Object3D
            textureUrl="bricks.jpg"
            position={position as [number, number, number]}
            repTex={repTex(4, 8)}
            objArgs={args as [number, number, number]}
            unaffected
            visible={visible}
        >
            <boxGeometry args={args as [number, number, number]} />
        </Object3D>
    );
}

export const Cube = ({ args,visible, ...props }: any) => {
    return (
        <Object3D
            position={[0, 0, 0]}
            textureUrl="default.png"
            objArgs={args as [number, number, number]}
            {...props}
            repTex={props.repTex ? props.repTex : repTex(1, 1)}
            visible={visible}
        >
            <boxGeometry args={args as [number, number, number]} />
        </Object3D>
    );
};

export const Table = ({ args, visible, ...props }: any) => {
    return (
        <Cube unaffected args={args} repTex={repTex(2, 2)} textureUrl="wood2.jpg" visible={visible} {...props} />
    );
};

interface LightProps {
    position: number[];
}
export function VisiblePointLight({ position }: LightProps, { ...props }) {
    const pos = new THREE.Vector3(...position);
    return (
        <Object3D position={[0, 2, -3]} objArgs={[20, 1, 20]}>
            <pointLight
                decay={0}
                intensity={Math.PI / 2}
                position={pos}
                {...props}
            />
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="yellow" />
        </Object3D>
    );
}

// export const Table = ({ args, ...props }: any) => {
//   const tableLength = 4;
//   const tableWidth = 2.5;
//   const tableThickness = 0.15;
//   const tableFootHeight = 0.8;
//   const tableFootSize = 0.15;
//   return (
//     <object3D {...props}>
//       {/* Main Table */}
//       <Cube
//         args={[tableLength, tableThickness, tableWidth]}
//         position={[0, 0, 0]}
//         repTex={repTex(2, 2)}
//         textureUrl="wood.jpg"
//         unaffected
//       />

//       {/* Table Legs */}
//       <Cube
//         args={[tableFootSize, tableFootHeight, tableFootSize]}
//         position={[
//           tableLength / 2 - tableFootSize / 2,
//           tableThickness / 2 - tableFootHeight / 2 - tableThickness,
//           tableWidth / 2 - tableFootSize / 2,
//         ]}
//         repTex={repTex(1, 1)}
//         textureUrl="wood.jpg"
//         unaffected
//       />

//       <Cube
//         args={[tableFootSize, tableFootHeight, tableFootSize]}
//         position={[
//           -tableLength / 2 + tableFootSize / 2,
//           tableThickness / 2 - tableFootHeight / 2 - tableThickness,
//           tableWidth / 2 - tableFootSize / 2,
//         ]}
//         repTex={repTex(1, 1)}
//         textureUrl="wood.jpg"
//         unaffected
//       />

//       <Cube
//         args={[tableFootSize, tableFootHeight, tableFootSize]}
//         position={[
//           -tableLength / 2 + tableFootSize / 2,
//           tableThickness / 2 - tableFootHeight / 2 - tableThickness,
//           -tableWidth / 2 + tableFootSize / 2,
//         ]}
//         repTex={repTex(1, 1)}
//         textureUrl="wood.jpg"
//         unaffected
//       />

//       <Cube
//         args={[tableFootSize, tableFootHeight, tableFootSize]}
//         position={[
//           tableLength / 2 - tableFootSize / 2,
//           tableThickness / 2 - tableFootHeight / 2 - tableThickness,
//           -tableWidth / 2 + tableFootSize / 2,
//         ]}
//         repTex={repTex(1, 1)}
//         textureUrl="wood.jpg"
//         unaffected
//       />
//     </object3D>
//   );
// };

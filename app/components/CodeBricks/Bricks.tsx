import React, { MutableRefObject, RefObject } from "react";
import CodeBrick, { CodeBrickProps } from "./CodeBrick";
import { PublicApi, Triplet } from "@react-three/cannon";
import { Object3D, Object3DEventMap, Vector3 } from "three";

function stopPhysics(api: PublicApi) {
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
}

const moveForward: CodeBrickProps["execute"] = async (distance: number, api: PublicApi, ref: MutableRefObject<Vector3>) => {
    console.log("Moving forward...", distance);
    stopPhysics(api);

    // Get the current rotation
    api.rotation.subscribe((v) => {
        return (ref.current = new Vector3(v[0], v[1], v[2]));
    });
    const rotation = ref.current;
    
    // Calculate the direction vector
    const direction = new Vector3(
        -Math.sin(rotation.y),
        0,
        -Math.cos(rotation.y)
    );

    // Apply force in the direction the cube is facing
    api.applyForce([direction.x * distance * 100, -direction.y * distance * 100, direction.z * distance * 100], [0, -1, 0]);

    // Correct the rotation of the cube
    await new Promise((resolve) => setTimeout(resolve, 1000));
    api.rotation.set(0, rotation.y, 0);
};

export const foward: CodeBrickProps = {
    color: "gray",
    label: "Forward",
    activated: false,
    input: 1,
    execute: moveForward,
};

const turnRight: CodeBrickProps["execute"] = (angle: number, api: PublicApi, ref: MutableRefObject<Vector3>) => {
    console.log("Turning right...", angle);
    // Get the current rotation
    api.rotation.subscribe((v) => {
        return (ref.current = new Vector3(v[0], v[1], v[2]));
    });
    const rotation = ref.current;
    stopPhysics(api);
    api.rotation.set(0, rotation.y + angle, 0);
    // api.position.set(ref.current.x, ref.current.y, ref.current.z);
};

export const right: CodeBrickProps = {
    color: "cyan",
    label: "Right",
    activated: false,
    input: 90,
    execute: turnRight,
};

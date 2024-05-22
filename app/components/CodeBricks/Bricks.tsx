import React, { MutableRefObject, RefObject } from "react";
import CodeBrick, { CodeBrickProps } from "./CodeBrick";
import { PublicApi, Triplet } from "@react-three/cannon";
import { Object3D, Object3DEventMap, Quaternion, Vector3 } from "three";

function stopPhysics(api: PublicApi) {
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
}

//-------------------------------------------------------------------------
const moveForward: CodeBrickProps["execute"] = async (distance: number, api: PublicApi, posRef: MutableRefObject<Vector3>, rotRef: MutableRefObject<Quaternion>) => {
    console.log("Moving forward...", distance);

    // Get the current position
    await new Promise(resolve => api.position.subscribe((v) => {
        posRef.current = new Vector3(v[0], v[1], v[2]);
        resolve(null);
    }));
    const position = posRef.current;

    // Get the current rotation
    await new Promise(resolve => api.quaternion.subscribe((v) => {
        rotRef.current = new Quaternion(v[0], v[1], v[2], v[3]);
        resolve(null);
    }));
    const rotation = rotRef.current;

    // Create a displacement vector that represents the forward direction
    const displacement = new Vector3(0, 0, distance * 0.1);

    // Rotate the displacement vector by the current orientation of the robot
    displacement.applyQuaternion(rotation);

    // Add the displacement to the current position
    const newPosition = position.add(displacement);

    // Set the new position
    api.position.set(newPosition.x, newPosition.y, newPosition.z);
    posRef.current = newPosition;

    console.log("position", posRef.current);
};
export const foward: CodeBrickProps = {
    color: "gray",
    label: "Forward",
    activated: false,
    input: 1,
    execute: moveForward,
};

//-------------------------------------------------------------------------
const moveBackward: CodeBrickProps["execute"] = async (distance: number, api: PublicApi, posRef: MutableRefObject<Vector3>, rotRef: MutableRefObject<Quaternion>) => {
    console.log("Moving backward...", distance);

    // Get the current position
    await new Promise(resolve => api.position.subscribe((v) => {
        posRef.current = new Vector3(v[0], v[1], v[2]);
        resolve(null);
    }));
    const position = posRef.current;

    // Get the current rotation
    await new Promise(resolve => api.quaternion.subscribe((v) => {
        rotRef.current = new Quaternion(v[0], v[1], v[2], v[3]);
        resolve(null);
    }));
    const rotation = rotRef.current;

    // Create a displacement vector that represents the forward direction
    const displacement = new Vector3(0, 0, -distance * 0.1);

    // Rotate the displacement vector by the current orientation of the robot
    displacement.applyQuaternion(rotation);

    // Add the displacement to the current position
    const newPosition = position.add(displacement);

    // Set the new position
    api.position.set(newPosition.x, newPosition.y, newPosition.z);
    posRef.current = newPosition;

    console.log("position", posRef.current);
};
export const backward: CodeBrickProps = {
    color: "#AAA",
    label: "Backward",
    activated: false,
    input: 1,
    execute: moveBackward,
};

//-------------------------------------------------------------------------
const turnRight: CodeBrickProps["execute"] = async (angle: number, api: PublicApi, ref: MutableRefObject<Vector3>, rotRef: MutableRefObject<Quaternion>) => {
    console.log("Turning right...", angle);

    // Get the current rotation
    await new Promise(resolve => api.quaternion.subscribe((v) => {
        rotRef.current = new Quaternion(v[0], v[1], v[2], v[3]);
        resolve(null);
    }));
    const rotation = rotRef.current;

    // Create a quaternion that represents a 90 degree rotation around the y-axis
    const rotationQuaternion = new Quaternion();
    rotationQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    // Multiply the current orientation quaternion by the rotation quaternion
    const newRotation = rotation.multiply(rotationQuaternion);

    // Set the new rotation
    api.quaternion.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);
    rotRef.current = newRotation;

    console.log("rotation", rotRef.current);
};
export const right: CodeBrickProps = {
    color: "cyan",
    label: "Right",
    activated: false,
    input: 90,
    execute: turnRight,
};

//-------------------------------------------------------------------------
const turnLeft: CodeBrickProps["execute"] = async (angle: number, api: PublicApi, ref: MutableRefObject<Vector3>, rotRef: MutableRefObject<Quaternion>) => {
    console.log("Turning left...", angle);

    // Get the current rotation
    await new Promise(resolve => api.quaternion.subscribe((v) => {
        rotRef.current = new Quaternion(v[0], v[1], v[2], v[3]);
        resolve(null);
    }));
    const rotation = rotRef.current;

    // Create a quaternion that represents a 90 degree rotation around the y-axis
    const rotationQuaternion = new Quaternion();
    rotationQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);

    // Multiply the current orientation quaternion by the rotation quaternion
    const newRotation = rotation.multiply(rotationQuaternion);

    // Set the new rotation
    api.quaternion.set(newRotation.x, newRotation.y, newRotation.z, newRotation.w);
    rotRef.current = newRotation;

    console.log("rotation", rotRef.current);
};
export const left: CodeBrickProps = {
    color: "green",
    label: "Left",
    activated: false,
    input: -90,
    execute: turnLeft,
};

//-------------------------------------------------------------------------
const makeJump: CodeBrickProps["execute"] = async (force: number, api: PublicApi, posRef: MutableRefObject<Vector3>) => {
    console.log("Jumping...", force);

    // Apply an upward force
    api.applyImpulse([0, force, 0], [0, 0, 0]);

    //wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Applied force", force);
};
export const jump: CodeBrickProps = {
    color: "orange",
    label: "Jump",
    activated: false,
    input: 3,
    execute: makeJump,
};

//-------------------------------------------------------------------------
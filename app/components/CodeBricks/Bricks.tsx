import React from "react";
import CodeBrick, { CodeBrickProps } from "./CodeBrick";

const moveForward: CodeBrickProps["execute"] = (distance: number) => {
    console.log("Moving forward...", distance);
    setTimeout(() => {
        console.log("Moved forward", distance);
    }, 1000);
};

export const foward: CodeBrickProps = {
    color: "gray",
    label: "Forward",
    activated: false,
    input: 10,
    execute: moveForward,
};

const turnRight: CodeBrickProps["execute"] = (angle: number) => {
    console.log("Turning right...", angle);
    setTimeout(() => {
        console.log("Turned right", angle);
    }, 1000);
};

export const right: CodeBrickProps = {
    color: "cyan",
    label: "Right",
    activated: false,
    input: 90,
    execute: turnRight,
};

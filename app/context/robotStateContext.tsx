// RobotRefContext.tsx
import React, { RefObject } from "react";
import { Object3D, Object3DEventMap } from "three";

// Define the robot's state
interface RobotState {
    robotRef?: React.MutableRefObject<any>;
}

// Initialize the state
const initialState: RefObject<Object3D<Object3DEventMap>> = {
    current: null,
};

// Create a context provider for the robot's state
const RobotRefContext = React.createContext<RefObject<Object3D<Object3DEventMap>>>(initialState);

export default RobotRefContext;

// refContext.tsx
import React, { RefObject } from "react";
import { Object3D, Object3DEventMap } from "three";

// Define the robot's state
interface RobotState {
  ref: React.MutableRefObject<Object3D<Object3DEventMap> | null>;
  api: any; // Replace 'any' with the actual type of your 'api'
}

// Initialize the state
const initialState: RobotState = {
  ref: { current: null },
  api: null, // Initialize 'api' with a suitable default value
};

// Create a context provider for the robot's state
const RobotContext = React.createContext<RobotState>(initialState);

export default RobotContext;
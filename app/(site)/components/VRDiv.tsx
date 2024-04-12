"use client";
import VRExperience from "./VRExperience";
import { VRButton } from "@react-three/xr";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import VrButton from "@/app/components/vrButton";

const VRDiv: React.FC = () => {
  const [vrMode, setVrMode] = React.useState(false);
  const vrButtonRef = React.useRef<HTMLButtonElement>(null);

  const staticClasses = 'z-inf absolute';
  const dynamicClasses = clsx({
    'top-1 left-1 opacity-50': vrMode,
    'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2': !vrMode
  });

  function changeVrMode() {
    if (vrButtonRef.current) {
      vrButtonRef.current.click();
      setVrMode(!vrMode);
    }
    else {
      alert("Error: VR Button not found")
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
    <div className="hidden">
        <VRButton ref={vrButtonRef} />
    </div>
    <button
      className={`${staticClasses} ${dynamicClasses}`}
      onClick={changeVrMode}
    >
      On/Off
    </button>
    {(vrMode ? 
    <div className="w-screen h-screen">
      <VRExperience />
    </div>
    : 
    <div className="border-4 border-gray-300 rounded-xl bg-cyan-800 w-3/6 h-3/6">
    </div> 
    )}
    </div>
  );
};
export default VRDiv;

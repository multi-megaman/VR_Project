"use client";
import VRExperience from "./VRExperience";
import { VRButton } from "@react-three/xr";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import VrButton from "@/app/components/vrButton";
import { BrickListProvider } from "@/app/context/brickListContext";

const VRDiv: React.FC = () => {
  const [vrMode, setVrMode] = React.useState(false);
  const vrButtonRef = React.useRef<HTMLButtonElement>(null);

  const staticClasses = "z-inf absolute";
  const dynamicClasses = clsx({
    "top-1 left-1 opacity-50": vrMode,
    "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-52":
      !vrMode,
  });

  function changeVrMode() {
    if (vrButtonRef.current) {
      vrButtonRef.current.click();
      setVrMode(!vrMode);
    } else {
      alert("Error: VR Button not found");
    }
  }

  return (
    <BrickListProvider>
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="hidden">
          <VRButton ref={vrButtonRef} />
        </div>
        <button
          className={`${staticClasses} ${dynamicClasses}`}
          onClick={changeVrMode}
        >
          &#9658;
        </button>
        {vrMode ? (
          <div className="w-screen h-screen">
            <VRExperience />
          </div>
        ) : (
          <>
            <h2 className="absolute top-1/4 text-2xl font-bold">Select your Level!</h2>
            <div className="absolute flex flex-row items-center gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="border-4 border-gray-300 rounded-xl bg-cyan-800 w-72 h-44 overflow-hidden hover:cursor-not-allowed">
                <img
                  src={"experiences/exp_3.png"}
                  alt="Experience 3"
                  className="w-96 h-64 object-cover rounded-lg filter brightness-50"
                />
              </div>
              <div className="border-4 border-gray-300 rounded-xl bg-cyan-800 w-96 h-52 overflow-hidden">
                <img
                  src={"experiences/exp_1.png"}
                  alt="Experience 1"
                  className="w-96 h-64 object-cover rounded-lg filter brightness-50"
                />
              </div>
              <div className="border-4 border-gray-300 rounded-xl bg-cyan-800 w-72 h-44 overflow-hidden hover:cursor-not-allowed">
                <img
                  src={"experiences/exp_2.png"}
                  alt="Experience 2"
                  className="w-96 h-64 object-cover rounded-lg filter brightness-50"
                />
              </div>
            </div>

            <h1 className="absolute bottom-0 w-full text-center text-7xl">
              &#8595; Tutorial &#8595;
            </h1>
          </>
        )}
      </div>
    </BrickListProvider>
  );
};
export default VRDiv;

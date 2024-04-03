"use client";
import VRExperience from "./VRExperience";
import { VRButton } from "@react-three/xr";
import React, { useEffect, useRef } from "react";

const VRDiv: React.FC = () => {
  const [vrMode, setVrMode] = React.useState(false);
  const [size, setSize] = React.useState("w-5/6 h-5/6");
  const [updatedSize, setUpdatedSize] = React.useState(false);
  const vrButtonRef = React.useRef<HTMLButtonElement>(null);

  function test() {
    if (!vrMode) {
      setSize("w-screen h-screen");
    } else {
      if (vrButtonRef.current) {
        vrButtonRef.current.click();
      }
      setSize("w-5/6 h-5/6");
    }
    setVrMode(!vrMode);
    console.log("size", size);
    return 1;
  }

  useEffect(() => {
    setUpdatedSize(true);
  }, [size]);

  useEffect(() => {
    if (vrButtonRef.current && size === "w-screen h-screen") {
      vrButtonRef.current.click();
      // setUpdatedSize(false);
    }
  }, [updatedSize]);

  function showInfos() {
    console.log("infos");
    console.log("size", size);
    console.log("vrMode", vrMode);
    console.log("updatedSize", updatedSize);
  }

  return (
    // using clsx to conditionally apply classes
    <div className={size}>
      <button onClick={() => test()} className="bg-red-100 w-10 h-10">
        TEst
      </button>
      <button onClick={() => showInfos()} className="bg-red-100 w-10 h-10">
        Infos
      </button>
      <VRButton ref={vrButtonRef} />
      <VRExperience />
    </div>
  );
};
export default VRDiv;

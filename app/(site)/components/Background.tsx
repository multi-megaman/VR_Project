"use client";
import React from "react";

  interface BackgroundProps {
    image: string;
  }
  //create the style of the background animation

  const Background: React.FC<BackgroundProps> = ({ image }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-50">
      <div
        className="animate-slowSlide bg-10 w-screen h-screen bg-cyan-700 "
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
};

export default Background;

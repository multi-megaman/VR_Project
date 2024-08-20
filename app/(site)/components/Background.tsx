"use client";
import React from "react";

interface BackgroundProps {
  image: string;
}
//create the style of the background animation

const Background: React.FC<BackgroundProps> = ({ image }) => {
  return (
    <>
    <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-700 to-purple-900 -z-20"></div>
    <div
        className="animate-slowSlide fixed top-0 left-0 w-full h-full bg-repeat opacity-30 blur-sm -z-10 bg-10"
        style={{ backgroundImage: `url(${image})`, backgroundRepeat: 'repeat' }}
    ></div>
</>
  );
};

export default Background;

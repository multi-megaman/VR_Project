import Image from "next/image";
import Background from "./components/Background";
import VRDiv from "./components/VRDiv";

export default function Home() {
  return (
    <main className="flex min-h-screen h-screen flex-col items-center p-4 z-10 overflow-hidden">
      <Background image="star.png" />

      <h1 className="flex flex-col items-center font-extrabold text-2xl drop-shadow-xl backdrop-blur-xl">
        VR Project!
        {/* <p className="text-center text-lg">
          Subtitle or slogan here
        </p> */}
      </h1>
      <VRDiv />
    </main>
  );
}

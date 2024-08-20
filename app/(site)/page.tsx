import Image from "next/image";
import Background from "./components/Background";
import VRDiv from "./components/VRDiv";
import TutorialDiv from "./components/TutorialDiv";

export default function Home() {
  return (
    <main className="flex w-screen h-full flex-col items-center p-4 z-10 overflow-x-hidden max-w-7xl mx-auto">
      <Background image="star.png" />

      <h1 className="flex flex-col items-center font-extrabold text-2xl drop-shadow-xl">
        VR Playcode!
        {/* <p className="text-center text-lg">
          Subtitle or slogan here
        </p> */}
      </h1>
      <VRDiv />

      <div className="flex flex-col items-center">
        <header className="pb-36">
          <h2 className="text-2xl font-bold">Welcome to VR Playcode!</h2>

          <p>How to play (Using a Meta Quest 3):</p>
        </header>

        <div className="flex flex-row flex-wrap justify-center gap-3">
          <TutorialDiv
            imagePath="tutorial/tutorial_1.png"
            text="Step 1: Select one of the experiences above and put on your VR headset."
          />
          <TutorialDiv
            imagePath="tutorial/tutorial_2.png"
            text="Step 2: Press the right grip to open or close the menu and use the left 'X' button to select and add a brick."
          />
          <TutorialDiv
            imagePath="tutorial/tutorial_3.png"
            text="Step 3: Each block added will go to the bricklist. Press the left controller grip to change the list position."
          />
          <TutorialDiv
            imagePath="tutorial/tutorial_4.png"
            text="Step 4: Press the 'A' button on the right controller to make the robot stop or execute the codebricks, from the top to the bottom."
          />
          <TutorialDiv
            imagePath="tutorial/tutorial_5.png"
            text="Step 5: You can grab and move the robot by poiting the right controller to it and holding the right trigger."
          />
        </div>
      </div>
    </main>
  );
}

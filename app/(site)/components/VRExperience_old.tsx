"use client";
import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";
import React, { useRef, useEffect } from "react";
import load3dObject from "../3DFunctions/load3dObject";

const VRExperience: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [xScale, setxScale] = React.useState(1);
  const [yScale, setyScale] = React.useState(1);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.layers.enable(2);

    const renderer = new THREE.WebGLRenderer(/*{ antialias: true }*/);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType("local");

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
      mountRef.current.appendChild(VRButton.createButton(renderer));

      const parentWidth = mountRef.current?.clientWidth;
      const parentHeight = mountRef.current?.clientHeight;
      const rendererWidth = renderer.domElement.width;
      const rendererHeight = renderer.domElement.height;

      const scaleX = parentWidth / rendererWidth;
      const scaleY = parentHeight / rendererHeight;

      setxScale(scaleX);
      setyScale(scaleY);
    }

    const cube = load3dObject(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      "freddy.jpg"
    );
    cube.translateX(-2);

    const ball = load3dObject(
      new THREE.SphereGeometry(1, 10, 10),
      "bonnie.jpg"
    );
    ball.translateX(1);

    const pyramid = load3dObject(
      new THREE.ConeGeometry(1, 1, 20),
      "chica.webp"
    );
    pyramid.translateX(-5);

    // const text = load3dObject(new THREE.TextGeometry("FNAF", {}), "foxy.jpg");
    const donut = load3dObject(
      new THREE.CylinderGeometry(1, 1, 1, 20),
      "foxy.jpeg"
    );
    donut.translateX(4);

    scene.add(ball);
    scene.add(cube);
    scene.add(pyramid);
    scene.add(donut);

    window.addEventListener("resize", onWindowResize);

    const animate = function () {
      renderer.setAnimationLoop(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        ball.rotation.x += 0.01;
        ball.rotation.y += 0.01;

        pyramid.rotation.x += 0.01;
        pyramid.rotation.y += 0.01;

        donut.rotation.x += 0.01;
        donut.rotation.y += 0.01;

        renderer.render(scene, camera);
      });
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      //   scene.dispose();
      while (scene.children.length > 0) {
        const object = scene.children[0];
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        scene.remove(object);
      }
    };
  }, []);

  return (
    <div className="absolute w-screen h-screen top-0 left-0 flex flex-col items-center justify-center border-8 overflow-hidden">
      <div className="w-5/6 h-5/6 p-0 flex items-center justify-center border-4 drop-shadow-xl rounded-md">
        <div
          ref={mountRef}
          style={{
            transform: `scaleX(${xScale}) scaleY(${yScale})`, // Scale x and y separately
            transformOrigin: "0 0", // Set transform origin to top left
            width: "100%", // Set width to 100%
            height: "100%", // Set height to 100%
            boxSizing: "border-box", // Include padding and border in width and height
          }}
        />
      </div>
      {/* <div ref={mountRef} /> */}
      {/* </div> */}
    </div>
  );
};

export default VRExperience;

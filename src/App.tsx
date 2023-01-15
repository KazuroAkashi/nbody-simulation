import React from "react";
import Sketch from "react-p5";
import type P5 from "p5";

const canvasWidth = 500;
const canvasHeight = 500;

export default function App() {
  const setup = (p5: P5, parent: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight)
      .position(
        -(canvasWidth / 2) + p5.windowWidth / 2,
        -(canvasHeight / 2) + p5.windowHeight / 2
      )
      .parent(parent);
  };

  const draw = (p5: P5) => {
    p5.background(0);
    p5.ellipse(canvasWidth / 2, canvasHeight / 2, 50, 50);
  };

  return <Sketch setup={setup} draw={draw} />;
}

import React from "react";
import Sketch from "react-p5";
import type P5 from "p5";
import { MassBody } from "./lib/MassBody";
import { Vector2 } from "./lib/Vector2";

const canvasWidth = 5000;
const canvasHeight = 5000;

let ox = canvasWidth / 2;
let oy = canvasHeight / 2;

const bodies = [
    new MassBody(new Vector2(0, 0), 100),
    new MassBody(new Vector2(200, 0), 20, new Vector2(0, -80)),
    new MassBody(new Vector2(-200, 0), 20, new Vector2(0, -80)),
    new MassBody(new Vector2(-250, 0), 20, new Vector2(0, 80)),
    new MassBody(new Vector2(0, 130), 20, new Vector2(95, 0)),
];

let lastTime: number;

export default function App() {
    lastTime = Date.now();

    const setup = (p5: P5, parent: Element) => {
        p5.createCanvas(canvasWidth, canvasHeight)
            .position(
                -(canvasWidth / 2) + p5.windowWidth / 2,
                -(canvasHeight / 2) + p5.windowHeight / 2
            )
            .parent(parent);
    };

    const draw = (p5: P5) => {
        p5.clear();
        p5.background(0);

        let now = Date.now();
        for (const body of bodies) {
            p5.ellipse(
                ox + body.get_pos().x,
                oy + body.get_pos().y,
                body.radius * 2,
                body.radius * 2
            );

            p5.stroke(255);

            for (let i = body.lastpos_start; i >= 0; i--) {
                const lastpos = body.lastpositions[i];
                const lastpos2 =
                    i > 0
                        ? body.lastpositions[i - 1]
                        : body.lastpositions[MassBody.MAX_LAST_POSITIONS - 1];
                p5.line(
                    ox + lastpos.x,
                    oy + lastpos.y,
                    ox + lastpos2.x,
                    oy + lastpos2.y
                );
            }

            for (
                let i = MassBody.MAX_LAST_POSITIONS - 1;
                i > body.lastpos_start + 1;
                i--
            ) {
                const lastpos = body.lastpositions[i];
                const lastpos2 = body.lastpositions[i - 1];
                p5.line(
                    ox + lastpos.x,
                    oy + lastpos.y,
                    ox + lastpos2.x,
                    oy + lastpos2.y
                );
            }

            body.update((now - lastTime) / 1000, bodies);
        }
        lastTime = now;
    };

    return <Sketch setup={setup} draw={draw} />;
}

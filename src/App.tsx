import React from "react";
import Sketch from "react-p5";
import type P5 from "p5";
import { MassBody } from "./lib/MassBody";
import { Vector2 } from "./lib/Vector2";

let canvas: P5.Renderer;

let ox = 0;
let oy = 0;

const bodies: MassBody[] = [
    /*new MassBody(new Vector2(0, 0), 100)*/
];

let lastTime: number;

let init = false;

export default function App() {
    lastTime = Date.now();

    const setup = (p5: P5, parent: Element) => {
        // To avoid double initialization
        if (init) return;
        init = true;

        ox = p5.displayWidth / 2;
        oy = p5.displayHeight / 2;

        canvas = p5
            .createCanvas(p5.displayWidth, p5.displayHeight)
            .position(-ox + p5.windowWidth / 2, -oy + p5.windowHeight / 2)
            .parent(parent);

        // bodies.push(new MassBody(new Vector2(200, 0), 20, new Vector2(0, -80)));
        // bodies.push(
        //     new MassBody(new Vector2(0, -150), 20, new Vector2(-100, 0))
        // );
        // bodies.push(new MassBody(new Vector2(-250, 0), 20, new Vector2(0, 60)));
        // bodies.push(new MassBody(new Vector2(0, 120), 20, new Vector2(100, 0)));
        fill_random_bodies(60, 450, 300, 2, 20, 80, 80);
    };

    const draw = (p5: P5) => {
        p5.clear();
        p5.background(0);

        p5.stroke(255);

        let now = Date.now();
        for (const body of bodies) {
            p5.ellipse(
                ox + body.get_pos().x,
                oy + body.get_pos().y,
                body.radius * 2
            );

            for (let i = body.lastpos_start; i >= 0; i--) {
                if (
                    i === 0 &&
                    body.lastpos_start == MassBody.MAX_LAST_POSITIONS - 1
                )
                    break;

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

            body.update((1.5 * (now - lastTime)) / 1000, bodies);
        }
        lastTime = now;
    };

    const mouseDragged = (p5: P5) => {
        if (p5.mouseButton != "left") return;

        const movex = p5.mouseX - p5.pmouseX;
        const movey = p5.mouseY - p5.pmouseY;

        p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);

        ox += movex;
        oy += movey;
    };

    return <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} />;
}

function fill_random_bodies(
    count: number = 20,
    xlimit: number = 450,
    ylimit: number = 300,
    radstart: number = 5,
    maxrad: number = 50,
    velxlimit: number = 75,
    velylimit: number = 75
) {
    for (let i = 0; i < count; i++) {
        let pos = new Vector2(0, 0);
        let loop = true;
        while (loop) {
            loop = false;
            pos = new Vector2(
                Math.random() * (2 * xlimit) - xlimit,
                Math.random() * (2 * ylimit) - ylimit
            );
            for (let body of bodies) {
                if (
                    pos.subtract(body.get_pos()).length_sq() <
                    body.radius * body.radius + 5
                ) {
                    loop = true;
                    break;
                }
            }
        }

        bodies.push(
            new MassBody(
                pos,
                Math.random() * (maxrad - radstart) + radstart,
                new Vector2(
                    Math.random() * (2 * velxlimit) - velxlimit,
                    Math.random() * (2 * velylimit) - velylimit
                )
            )
        );
    }
}

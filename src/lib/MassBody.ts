import { Vector2 } from "./Vector2";

/**
 * Can be changed according to intended physical effects.
 * Using the real value would be pointless because our masses and radii are very small.
 */
export const GRAVITATIONAL_CONSTANT = 100;

export class MassBody {
    public static readonly MAX_LAST_POSITIONS = 50;

    private accel = new Vector2(0, 0);
    public lastpositions = new Array<Vector2>(MassBody.MAX_LAST_POSITIONS);
    public lastpos_start = 0;
    private lastpos_counter = this.lastpos_start;

    constructor(
        /**
         * Position will be centered at the center of the screen
         */
        private pos: Vector2,
        readonly radius: number,
        private vel: Vector2 = new Vector2(0, 0),
        private readonly mass: number = radius * radius
    ) {
        this.lastpositions.fill(this.pos);
    }

    get_pos() {
        return this.pos;
    }

    update(delta: number, bodies: MassBody[]) {
        console.log(delta, 1 / delta);
        this.lastpositions[this.lastpos_counter] = this.pos;

        this.lastpos_start = this.lastpos_counter;

        if (this.lastpos_counter == MassBody.MAX_LAST_POSITIONS - 1) {
            this.lastpos_counter = 0;
        } else {
            this.lastpos_counter++;
        }

        let new_pos = this.pos
            .add(this.vel.multiply(delta))
            .add(this.accel.multiply(delta * delta * 0.5));
        let new_accel = new Vector2(0, 0);

        for (const body of bodies) {
            if (this === body) continue;

            const dir = body.pos.subtract(new_pos);
            const normal = dir.normalized();

            const totalrad = this.radius + body.radius;

            if (dir.length_sq() < totalrad * totalrad) {
                const totalmass = this.mass + body.mass;

                /**
                 * Positioning this object outside of the obj
                 * and transferring momentums
                 */
                new_pos = body
                    .get_pos()
                    .add(normal.multiply(-(this.radius + body.radius)));

                const this_parallel = normal.multiply(this.vel.dot(normal));
                const body_parallel = normal.multiply(body.vel.dot(normal));

                this.vel = this.vel
                    .subtract(this_parallel)
                    .add(
                        this_parallel
                            .multiply((this.mass - body.mass) / totalmass)
                            .add(
                                body_parallel.multiply(
                                    (2 * body.mass) / totalmass
                                )
                            )
                    );

                body.vel = body.vel
                    .subtract(body_parallel)
                    .add(
                        body_parallel
                            .multiply((body.mass - this.mass) / totalmass)
                            .add(
                                this_parallel.multiply(
                                    (2 * this.mass) / totalmass
                                )
                            )
                    );
            }

            new_accel = new_accel.add(
                normal.multiply(
                    (GRAVITATIONAL_CONSTANT * body.mass) / dir.length_sq()
                )
            );
        }

        this.vel = this.vel.add(
            this.accel.add(new_accel).multiply(delta * 0.5)
        );
        this.accel = new_accel;
        this.pos = new_pos;
    }
}

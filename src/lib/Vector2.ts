export class Vector2 {
    constructor(readonly x: number, readonly y: number) {}

    add(other: Vector2) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other: Vector2) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    multiply(num: number) {
        return new Vector2(this.x * num, this.y * num);
    }

    dot(other: Vector2) {
        return this.x * other.x + this.y * other.y;
    }

    negate() {
        return new Vector2(-this.x, -this.y);
    }

    length_sq() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.length_sq());
    }

    normalized() {
        return new Vector2(this.x / this.length(), this.y / this.length());
    }
}

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sub = (vec) => {
        return new Vector2D(
            this.x - vec.x,
            this.y - vec.y,
        );
    }

    add = (vec) => {
        return new Vector2D(
            this.x + vec.x,
            this.y + vec.y,
        );
    }

    scale = (value) => {
        return new Vector2D(
            this.x * value,
            this.y * value,
        );
    }

    length = () => {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
}

export { Vector2D };
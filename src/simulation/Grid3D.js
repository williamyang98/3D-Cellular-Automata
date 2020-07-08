export class Grid3D {
    static Create(shape) {
        let sk = {}
        sk.shape = shape;
        sk.count = shape[0] * shape[1] * shape[2];

        sk.XY = shape[0]*shape[1];
        sk.X = shape[0];

        sk.cells = new Uint8Array(sk.count);
        sk.neighbours = new Uint8Array(sk.count);
        sk.updates = new Set();
        sk.render_updates = new Set();
        // sk.updates = new Uint8Array(sk.count);
        // sk.updates_buffer = new Uint8Array(sk.count);

        sk.transferables = [
            sk.cells.buffer,
            sk.neighbours.buffer,
            // sk.updates.buffer,
            // sk.updates_buffer.buffer,
        ];

        return new Grid3D(sk);
    }

    constructor(sk) {
        this.shape = sk.shape;
        this.count = sk.count;

        this.XY = sk.XY;
        this.X = sk.X;

        this.cells = sk.cells
        this.cells_buffer = sk.cells_buffer;
        this.neighbours = sk.neighbours;
        this.updates = sk.updates;
        this.updates_buffer = sk.updates_buffer;
        this.render_updates = sk.render_updates;

        this.transferables = sk.transferables;
    }

    clear() {
        this.cells.fill(0, 0, this.count);
        this.neighbours.fill(0, 0, this.count);
        this.updates.clear();
        this.render_updates.clear();
    }

    xyz_to_i(x, y, z) {
        return x + y*this.X + z*this.XY;
    }

    i_to_xyz(i) {
        let z = Math.floor(i/this.XY);
        i = i-z*this.XY;
        let y = Math.floor(i/this.X);
        let x = i-y*this.X;
        return [x, y, z];
    }

    i_to_xyz_inplace(i, xyz) {
        let z = Math.floor(i/this.XY);
        i = i-z*this.XY;
        let y = Math.floor(i/this.X);
        let x = i-y*this.X;

        xyz[0] = x;
        xyz[1] = y;
        xyz[2] = z;
    }
}
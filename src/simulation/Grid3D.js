export class Grid3D {
    static Create(shape) {
        let sk = {}
        sk.shape = shape;
        sk.count = shape[0] * shape[1] * shape[2];

        sk.XY = shape[0]*shape[1];
        sk.X = shape[0];

        sk.cells = new Uint8Array(sk.count);
        sk.cells_buffer = new Uint8Array(sk.count);
        sk.neighbours = new Uint8Array(sk.count);
        sk.updates = new Uint8Array(sk.count);
        sk.updates_buffer = new Uint8Array(sk.count);

        sk.transferables = [
            sk.cells.buffer,
            sk.cells_buffer.buffer,
            sk.neighbours.buffer,
            sk.updates.buffer,
            sk.updates_buffer.buffer,
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
        this.updates = sk.updates;
        this.updates_buffer = sk.updates_buffer;
        this.neighbours = sk.neighbours;

        this.transferables = sk.transferables;
    }

    swap_buffers() {
        let tmp = this.cells;
        this.cells = this.cells_buffer;
        this.cells_buffer = tmp;

        tmp = this.updates;
        this.updates = this.updates_buffer;
        this.updates_buffer = tmp;
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
}
export class Grid3D {
    constructor(grid) {
        this.shape = grid.shape;
        this.count = grid.count;

        this.XY = this.shape[0]*this.shape[1];
        this.X = this.shape[0];

        this.cells = grid.cells;
        this.cells_buffer = grid.cells_buffer;
        this.neighbours = grid.neighbours;
        this.should_update = grid.should_update;

        this.transferables = [
            this.cells.buffer,
            this.cells_buffer.buffer,
            this.neighbours.buffer,
            this.should_update.buffer,
        ];
    }

    swap_buffer() {
        let tmp = this.cells;
        this.cells = this.cells_buffer;
        this.cells_buffer = tmp;
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
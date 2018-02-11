class Goal extends Actor {
    constructor (position, size, animation, draw_priority, block_layers) {
        super(position, size, animation, draw_priority, block_layers, -1.0);
        this.cube_count = 0;
    }
}
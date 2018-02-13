var cube_stack_id_list = [];

class Cube_Stack extends Actor {
    constructor (position, draw_priority) {
        super(position, new Vector(1.0, 0.66), new Animation("Cube Stack Animation", Sprite.green),
    draw_priority, [], -1);

        cube_stack_id_list.push(this.id);

        // TODO: decide if we want to have a limited number of cubes
        this.cube_count = 1;
    }
}
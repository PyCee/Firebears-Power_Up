var Switch_Cube_Relative_Positioning = [
    new Vector(0.15, -0.32),
    new Vector(0.60, -0.32),
    new Vector(1.05, -0.32),
    new Vector(0.375, -0.64),
    new Vector(0.825, -0.64),
    new Vector(0.60, -0.96)
];

var switch_id_list = [];
class Switch_Component extends Goal {
    constructor (position, draw_priority) {
        super(position, new Vector(1.5, 0.5), new Animation("Switch", Sprite.blue), draw_priority, []);
        switch_id_list.push(this.id);
    }
    add_cube (cube) {
        var cube_relative_position = Switch_Cube_Relative_Positioning[this.cube_count];
        cube.set_position(this.display_position.add(cube_relative_position));
        cube.freeze();
        cube.set_block_layers([]);
        this.cube_count++;
    }
}
const SECOND_SWITCH_OFFSET = new Vector(1.6, 0.0);
class Switch {
    constructor (position, draw_priority) {
        this.left_component = new Switch_Component(position, draw_priority);
        this.right_component = new Switch_Component(position.add(SECOND_SWITCH_OFFSET), draw_priority);
    }
}
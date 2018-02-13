var Switch_Cube_Relative_Positioning = [
    new Vector(0.0, -0.4),
    new Vector(0.45, -0.4),
    new Vector(0.90, -0.4),
    new Vector(0.275, -0.8),
    new Vector(0.725, -0.8),
    new Vector(0.45, -1.2)
];

var switch_id_list = [];

class Switch extends Goal {
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
var Switch_Cube_Relative_Positioning = [
    new Vector(0.15, 0.025),
    new Vector(0.60, 0.025),
    new Vector(1.05, 0.025),
    new Vector(0.375, -0.295),
    new Vector(0.825, -0.295)
];
function Get_Next_Cube_Offset (cube_index) {
    if(cube_index <= 4){
        return Switch_Cube_Relative_Positioning[cube_index];
    } else {
        return new Vector(0.60, -0.295 - (0.32 * (cube_index - 4)));
    }
}
var switch_id_list = [];
class Switch_Component extends Goal {
    constructor (position, draw_priority, allience) {
        super(position, draw_priority, allience, 
                [
                    new Collision_Box(new Vector(1.5, 0.5),
                        new Vector(0.0, 0.0), [])
                ]);
        this.cube_count = 0;
        switch_id_list.push(this.id);
    }
    get_cube_count () {
        return this.cube_count;
    }
    add_cube (cube) {
        var cube_relative_position = Get_Next_Cube_Offset(this.get_cube_count());
        cube.set_absolute_position(this.position.add(cube_relative_position));
        cube.physics_state.freeze();
        cube.set_ghost();
        cube.draw_priority = 1;
        this.cube_count++;
    }
}
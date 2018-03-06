var Switch_Cube_Relative_Positioning = [
    new Vector(0.15, -0.32),
    new Vector(0.60, -0.32),
    new Vector(1.05, -0.32),
    new Vector(0.375, -0.64),
    new Vector(0.825, -0.64)
];
function Get_Next_Cube_Offset (cube_index) {
    if(cube_index <= 4){
        return Switch_Cube_Relative_Positioning[cube_index];
    } else {
        return new Vector(0.60, -0.64 - (0.32 * (cube_index - 4)));
    }
}

var switch_id_list = [];
class Switch_Component extends Actor {
    constructor (position, draw_priority, sprite) {
        super(position, new Vector(1.5, 0.5),
            new Animation("Switch", sprite), draw_priority,
            function(){}, -1, [
                new Collision_Box(new Vector(1.5, 0.5),
                    new Vector(0.0, 0.0), [])
            ]);
        this.cube_count = 0;
        switch_id_list.push(this.id);
    }
    add_cube (cube) {
        var cube_relative_position = Get_Next_Cube_Offset(this.cube_count);
        cube.set_absolute_position(this.position.add(cube_relative_position));
        cube.physics_state.freeze();
        cube.set_ghost();
        this.cube_count++;
    }
}
const SECOND_SWITCH_OFFSET = new Vector(1.6, 0.0);
class Switch {
    constructor (position, draw_priority) {
        this.ally_side = new Switch_Component(position, draw_priority, Sprite.blue);
        this.opp_side = new Switch_Component(position, draw_priority, Sprite.red);
        var own_left = Math.floor(Math.random() * 2);
        if(own_left){
            this.opp_side.set_absolute_position(this.opp_side.position.add(SECOND_SWITCH_OFFSET));
        } else {
            this.ally_side.set_absolute_position(this.ally_side.position.add(SECOND_SWITCH_OFFSET));
        }
    }
}
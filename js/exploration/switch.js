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
    get_cube_count () {
        return this.cube_count;
    }
    add_cube (cube) {
        var cube_relative_position = Get_Next_Cube_Offset(this.get_cube_count());
        cube.set_absolute_position(this.position.add(cube_relative_position));
        cube.physics_state.freeze();
        cube.set_ghost();
        this.cube_count++;
    }
}
const SWITCH_SIDE = {
    ALLY: "Ally",
    OPP: "Opponent",
    NEITHER: "Neither"
};
const SECOND_SWITCH_OFFSET = new Vector(1.6, 0.0);
class Switch {
    constructor (position, draw_priority) {
        this.ally_side = new Switch_Component(position, draw_priority, Sprite.blue_scale);
        this.opp_side = new Switch_Component(position, draw_priority, Sprite.red_scale);
        var own_left = Math.floor(Math.random() * 2);
        if(own_left){
            this.opp_side.set_absolute_position(this.opp_side.position.add(SECOND_SWITCH_OFFSET));
        } else {
            this.ally_side.set_absolute_position(this.ally_side.position.add(SECOND_SWITCH_OFFSET));
        }
    }
    get_down () {
        // Returns which side has more cubes
        if(this.ally_side.get_cube_count() > this.opp_side.get_cube_count()){
            return SWITCH_SIDE.ALLY;
        } else if (this.ally_side.get_cube_count() < this.opp_side.get_cube_count()){
            return SWITCH_SIDE.OPP;
        } else {
            return SWITCH_SIDE.NEITHER;
        }
    }

}
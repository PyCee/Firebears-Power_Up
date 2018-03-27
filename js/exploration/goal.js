const GOAL_COMPONENT = {
    SIZE: new Vector(1.5, 0.5),
    OFFSET: new Vector(1.6, 0.0),
    TYPE: {
        SWITCH: "SWITCH",
        SCALE: "SCALE"
    }
};
class Goal extends Actor {
    constructor (position, draw_priority, allience, collision_boxes){
        var sprite = null;
        switch(allience){
        case ALLIENCE_TYPE.BLUE:
            sprite = Sprite.blue_goal;
            break;
        case ALLIENCE_TYPE.RED:
            sprite = Sprite.red_goal;
            break;
        default:
            break;
        }
        super(position, new Vector(1.5, 0.5),
            new Animation("Goal", sprite), draw_priority,
            function(){}, -1, collision_boxes);
        this.allience = allience;
    }
    get_cube_count () {}
    update_position () {}
}
const ALLIENCE_TYPE = {
    BLUE: "B",
    RED: "R",
    NEITHER: "N"
};
class Goal_Pair {
    constructor (position, draw_priority, goal_type) {
        this.position = position;

        switch(goal_type){
        case GOAL_COMPONENT.TYPE.SWITCH:
            this.blue_component = new Switch_Component(position, draw_priority,
                ALLIENCE_TYPE.BLUE);
            this.red_component = new Switch_Component(position, draw_priority,
                ALLIENCE_TYPE.RED);
            break;
        case GOAL_COMPONENT.TYPE.SCALE:
            this.blue_component = new Scale_Component(position, draw_priority,
                ALLIENCE_TYPE.BLUE);
            this.red_component = new Scale_Component(position, draw_priority,
                ALLIENCE_TYPE.RED);
            break;
        default:
            break;
        }
        if(Math.floor(Math.random() * 2)){
            this.set_left(ALLIENCE_TYPE.BLUE);
        } else {
            this.set_left(ALLIENCE_TYPE.RED);
        }
    }
    set_left (allience_type) {
        switch(allience_type){
        case ALLIENCE_TYPE.BLUE:
            this.blue_component.set_absolute_position(this.position);
            this.red_component.set_absolute_position(this.position.add(GOAL_COMPONENT.OFFSET));
            break;
        case ALLIENCE_TYPE.RED:
            this.blue_component.set_absolute_position(this.position.add(GOAL_COMPONENT.OFFSET));
            this.red_component.set_absolute_position(this.position);
            break;
        default:
            break;
        }
        this.blue_component.update_position();
        this.red_component.update_position();
    }
    get_ownership () {
        // Returns which side has more cubes
        if(this.blue_component.get_cube_count() > this.red_component.get_cube_count()){
            return ALLIENCE_TYPE.BLUE;
        } else if (this.red_component.get_cube_count() > this.blue_component.get_cube_count()){
            return ALLIENCE_TYPE.RED;
        } else {
            return ALLIENCE_TYPE.NEITHER;
        }
    }
}

// Switch
const Switch_Cube_Relative_Positioning = [
    new Vector(0.15, 0.025),
    new Vector(0.60, 0.025),
    new Vector(1.05, 0.025),
    new Vector(0.375, -0.295),
    new Vector(0.825, -0.295)
];
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
        var cube_relative_position = this.get_next_cube_offset();
        cube.set_absolute_position(this.position.add(cube_relative_position));
        cube.physics_state.freeze();
        cube.set_ghost();
        cube.draw_priority = 1;
        this.cube_count++;
    }
    get_next_cube_offset () {
        if(this.get_cube_count() <= 4){
            return Switch_Cube_Relative_Positioning[this.get_cube_count()];
        } else {
            return new Vector(0.60, -0.295 - (0.32 * (this.get_cube_count() - 4)));
        }
    }
}

// Scale
const SCALE_SCORING_BOX_SIZE = new Vector(1.5, 5.0);
class Scale_Component extends Goal {
    constructor (position, draw_priority, allience) {
        super(position, draw_priority, allience, 
            [
                // Bottom
                new Collision_Box(new Vector(1.5, 0.15),
                    new Vector(0.0, 0.35), [-1]),
                // Left
                new Collision_Box(new Vector(0.1, 0.35),
                    new Vector(0.0, 0.0), [-1]),
                // Right
                new Collision_Box(new Vector(0.1, 0.35),
                    new Vector(1.4, 0.0), [-1])
            ]);

        this.scoring_box = new Collision_Box(SCALE_SCORING_BOX_SIZE,
            new Vector(0.0, 0.5 - SCALE_SCORING_BOX_SIZE.y), [],
            this.position);
    }
    update_position () {
        this.scoring_box.set_parent_position(this.position);
    }
    get_cube_count () {
        var cube_count = 0;
        for(var i = 0; i < power_cube_id_list.length; ++i){
            // For each power cube
            var cube = exploration.scene.get_renderable_from_id(power_cube_id_list[i]);
            if(!cube){
                continue;
            }
            for(var j = 0; j < cube.physics_state.collision_boxes.length; ++j){
                if(this.scoring_box.intersects(cube.physics_state.collision_boxes[j])){
                    cube_count++;
                }
            }
        }
        return cube_count;
    }
}
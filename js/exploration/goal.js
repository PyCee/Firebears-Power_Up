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
var Direction = {
    left: 0,
    right: 1
}
var power_cube_id_list = [];
const CUBE_LAUNCH_Y_VELOCITY = -7.0;

class Robot extends Actor{
    constructor (position, size, animation, draw_priority, mass,
            collision_boxes, allience=ALLIENCE_TYPE.NEITHER){
        super(position, size, animation, draw_priority,
            function(){}, mass, collision_boxes);
        this.cube = null;
        this.facing = Direction.right;
        this.allience = allience;
    }
    turn_right () {this.facing = Direction.right;}
    turn_left () {this.facing = Direction.left;}
    pickup () {
        if(this.cube != null){
            return;
        }
        for(var i = 0; i < aquisition_id_list.length; ++i){
            var aquisition = exploration.scene.get_renderable_from_id(aquisition_id_list[i]);
            if(aquisition.physics_state.intersects(this.physics_state)){
                // TODO: change animation to indicate the robot has a cube
                this.cube = aquisition.get_cube();
                // TODO: set cube above robot
                
                if(this.cube){
                    this.cube.set_ghost();
                    this.cube.hide();
                }
            }
        }
    }
    has_cube () {return this.cube != null;}
    launch () {
        if(this.has_cube()){
            this.cube.set_absolute_position(robot.position.add(new Vector(0.25, -0.5)));
            this.cube.show();
            this.cube.set_freeze(false);
            this.cube.set_ghost(false);
            switch(this.facing){
            case Direction.right:
                this.cube.impulse_momentum(new Vector(2.0, CUBE_LAUNCH_Y_VELOCITY));
                break;
            case Direction.left:
                this.cube.impulse_momentum(new Vector(-2.0, CUBE_LAUNCH_Y_VELOCITY));
                break;
            default:
                break;
            }
            exploration.scene.add_renderable(this.cube);
            Arena.map.add_actor(this.cube);
            this.cube = null;
        } else {
            console.log("attempting to shoot with no cube");
        }
    }
    place () {
        if(this.has_cube()){
            // If the robot has a cube
            for(var i = 0; i < switch_id_list.length; ++i){
                // For each switch
                var sw = exploration.scene.get_renderable_from_id(switch_id_list[i]);
                if(this.physics_state.intersects(sw.physics_state) &&
                    this.allience === sw.allience){
                    // If the robot and switch intersect
                    this.cube.show();
                    this.cube.set_freeze(false);
                    this.cube.set_ghost(false);
                    sw.add_cube(this.cube);
                    exploration.scene.add_renderable(this.cube);
                    this.cube = null;
                    break;
                }
            }
        }
    }
}
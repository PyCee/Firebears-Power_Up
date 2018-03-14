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
        for(var i = 0; i < cube_stack_id_list.length; ++i){
            var cube_stack = exploration.scene.get_renderable_from_id(cube_stack_id_list[i]);
            if(cube_stack.physics_state.intersects(this.physics_state)){
                // change animation to indicate the robot has a cube
                var cube = new Power_Cube(new Vector(0.0, 0.0));
                this.cube = cube;
            }
        }
    }
    has_cube () {return this.cube != null;}
    launch () {
        if(this.has_cube()){
            // var power_block = new Power_Cube(robot.last_position.add(new Vector(0.25, -0.5)));
            this.cube.set_absolute_position(robot.position.add(new Vector(0.25, -0.5)));
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
                    sw.add_cube(this.cube);
                    exploration.scene.add_renderable(this.cube);
                    this.cube = null;
                    break;
                }
            }
        }
    }
}
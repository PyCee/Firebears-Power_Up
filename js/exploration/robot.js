var Direction = {
    left: 0,
    right: 1
}
var power_cube_id_list = [];
const CUBE_LAUNCH_Y_VELOCITY = -7.0;

class Robot extends Actor{
    constructor (position, size, animation, cube_animation, draw_priority, mass,
            collision_boxes, allience=ALLIENCE_TYPE.NEITHER){
        super(position, size, animation, draw_priority,
            function(){}, mass, collision_boxes);
        this.no_cube_animation = this.animation;
        this.cube_animation = cube_animation;
        this.cube = null;
        this.facing = Direction.right;
        this.allience = allience;
        this.pickup_timer = new Timeline();
        this.pickup_wait = 1.0;
    }
    turn_right () {
        this.facing = Direction.right;
        this.animation.set_flip(false);
    }
    turn_left () {
        this.facing = Direction.left;
        this.animation.set_flip(true);
    }
    set_pickup_wait (wait) {
        this.pickup_wait = wait;
    }
    pickup () {
        if(this.cube != null){
            return;
        }
        if(this.pickup_timer.get_elapsed_time() < this.pickup_wait){
            return;
        }
        for(var i = 0; i < aquisition_id_list.length; ++i){
            var aquisition = exploration.scene.get_renderable_from_id(aquisition_id_list[i]);
            if(aquisition == null){
                continue;
            }
            if(aquisition.physics_state.intersects(this.physics_state)){
                this.cube = aquisition.get_cube();
                if(this.cube){
                    var flipped = this.animation.horizontal_flip;
                    this.set_animation(this.cube_animation);
                    this.animation.set_flip(flipped);
                    this.cube.set_ghost();
                    this.cube.hide();
                    this.pickup_timer.reset();
                    break;
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
            exploration.map.add_actor(this.cube);
            this.cube = null;
            
            var flipped = this.animation.horizontal_flip;
            this.set_animation(this.no_cube_animation);
            this.animation.set_flip(flipped);
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
                if(sw == null) {
                    continue;
                }
                if(this.physics_state.intersects(sw.physics_state) &&
                    this.allience === sw.allience){
                    // If the robot and switch intersect
                    this.cube.show();
                    this.cube.set_freeze(false);
                    this.cube.set_ghost(false);
                    sw.add_cube(this.cube);
                    exploration.scene.add_renderable(this.cube);
                    this.cube = null;
                    var flipped = this.animation.horizontal_flip;
                    this.set_animation(this.no_cube_animation);
                    this.animation.set_flip(flipped);
                    break;
                }
            }
        }
    }
}
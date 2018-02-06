var Direction = {
    left: 0,
    right: 1
}

class Robot extends Actor{
    constructor (position, size, animation, draw_priority){
        super(position, size, animation, draw_priority);
        this.has_block = false;
        this.facing = Direction.right;
    }
    turn_right () {this.facing = Direction.right;}
    turn_left () {this.facing = Direction.left;}
    pickup () {

    }
    launch () {
        var power_block = new Actor(robot.position.add(new Vector(0.25, -0.5)), new Vector(0.4, 0.4),
								new Animation(Sprite.green, "Power Cube Idle"), 1,
                                true);
        switch(this.facing){
        case Direction.right:
            power_block.impulse_momentum(new Vector(2.0, -7.0));
            break;
        case Direction.left:
            power_block.impulse_momentum(new Vector(-2.0, -7.0));
            break;
        default:
            break;
        }
	    exploration.scene.add_renderable(power_block);
	    power_block.update = function(){
            // Change to: if cube collides with anything, stop moving in that axis
		    if(exploration.scene.get_renderable_from_id(power_block.id).position.y > 
		        exploration.scene.inside_width * canvas_dimensions.aspect_ratio.multiplier - 0.9001){
                // If the cube is interacting with the ground,
                //   stop it from moving
                exploration.scene.get_renderable_from_id(power_block.id).velocity = new Vector(0.0, 0.0);
		    }
	    }
    }
    drop () {

    }
}
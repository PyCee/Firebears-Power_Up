var FORCE_DUE_TO_GRAVITY = 9.8;

class Actor extends Renderable {
    constructor (position, size, animation, draw_priority=1, blocking=true, movable=true,
		 mass=1.0, update=function(){}) {
	super(position, size, animation, draw_priority);
	this.bounding_box = new Block(this.position, this.size);
	this.blocking = blocking;
	this.movable = movable;
	this.acceleration = new Vector(0.0, 0.0);
	this.velocity = new Vector(0.0, 0.0);
	this.mass = mass;
	this.update = update;
	this.impulse_force(new Vector(0.0, FORCE_DUE_TO_GRAVITY * this.mass));
    }
    update (delta_s) {}
    set_position (position) {
	this.position = position;
	this.bounding_box = new Block(this.position, this.size);
	}
	impulse_force (force) {
		this.acceleration = this.acceleration.add(force.scale(1.0 / this.mass));
	}
	impulse_momentum (momentum) {
		this.velocity = this.velocity.add(momentum.scale(1.0 / this.mass));
	}
    step_physics (actors) {
	if(!this.movable){
	    return;
	}
	this.velocity = this.velocity.add(this.acceleration.scale(PHYSICS_UPDATE_DELTA_S));
	this.position = this.position.add(this.velocity.scale(PHYSICS_UPDATE_DELTA_S));
	if(!this.blocking){
		return;
	}
	for(var i = 0; i < actors.length; ++i){
	    if(actors[i].id == this.id){
			// If this actor is being tested with itself
			continue;
	    } else if(!actors[i].blocking){
			// If the actor is blocking
			continue;
	    }
	    var updated_bb = new Block(this.position, this.size);
		if(actors[i].bounding_box.intersects(updated_bb)){
		// If the actor's bounding box and the block intersect
		// Check the previous relative position and un-intersect the actor
		// Check where the actor was before the recent update
		// and press them against the wall

			var pre_inter =
			    actors[i].bounding_box.detect_intersection(this.bounding_box);
		
			switch(pre_inter){
			case block_relative_position.left:
			    this.position.x = actors[i].bounding_box.position.x - this.size.x;
			    break;
			case block_relative_position.right:
			    this.position.x = actors[i].bounding_box.position.x +
				actors[i].bounding_box.size.x;
			    break;
			case block_relative_position.above:
			    this.position.y = actors[i].bounding_box.position.y - this.size.y;
				this.velocity = new Vector(this.velocity.x, 0.0);
			    break;
			case block_relative_position.below:
			    this.position.y = actors[i].bounding_box.position.y +
				actors[i].bounding_box.size.y;
				this.velocity = new Vector(this.velocity.x, 0.0);
			    break;
			default:
			    break;
			}
			//i = 0;
	    }
	}
	this.bounding_box = new Block(this.position, this.size);
    }
}

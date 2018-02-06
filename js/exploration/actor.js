var FORCE_DUE_TO_GRAVITY = 9.8;

class Actor extends Renderable {
    constructor (position, size, animation, draw_priority=1, blocking=true,
		 mass=1.0, update=function(){}) {
	super(position, size, animation, draw_priority);
	this.bounding_box = new Block(this.position, this.size);
	this.blocking = blocking; // Replace blocking with
	this.old_bb = new Block(this.position, this.size);
	this.acceleration = new Vector(0.0, 0.0);
	this.velocity = new Vector(0.0, 0.0);
	this.mass = mass;
	this.update = update;
	}
	is_moveable () {
		return this.mass != -1;
	}
    update (delta_s) {}
    set_position (position) {
		this.position = position;
		this.bounding_box = new Block(this.position, this.size);
	}
	get_force () {return this.acceleration.scale(this.mass);}
	impulse_force (force) {
		this.acceleration = this.acceleration.add(force.scale(1.0 / this.mass));
	}
	get_momentum () {return this.velocity.scale(this.mass);}
	impulse_momentum (momentum) {
		this.velocity = this.velocity.add(momentum.scale(1.0 / this.mass));
	}
    step_physics () {
		if(!this.is_moveable()){return;}
		this.velocity = this.velocity.add(this.acceleration.scale(PHYSICS.UPDATE_DELTA_S));
		this.set_position(this.position.add(this.velocity.scale(PHYSICS.UPDATE_DELTA_S)));
	}
	step_x () {
		if(!this.is_moveable()){return;}
		this.velocity.x = this.velocity.x + this.acceleration.x * PHYSICS.UPDATE_DELTA_S;
		//this.set_position(this.position.add(new Vector(this.velocity.x * PHYSICS.UPDATE_DELTA_S, 0.0)));
		this.set_position(this.old_bb.position.add(new Vector(this.velocity.x * PHYSICS.UPDATE_DELTA_S, 0.0)));
	}
	step_y () {
		if(!this.is_moveable()){return;}
		this.velocity.y = this.velocity.y +
			(this.acceleration.y + FORCE_DUE_TO_GRAVITY) * PHYSICS.UPDATE_DELTA_S;
		//this.set_position(this.position.add(new Vector(0.0, this.velocity.y * PHYSICS.UPDATE_DELTA_S)));
		this.set_position(this.old_bb.position.add(new Vector(0.0, this.velocity.y * PHYSICS.UPDATE_DELTA_S)));
	}
	resolve_collisions (actors) {
		if(!this.blocking){
			// If this actor is not blocking,
			//   No reason to test for collisions
			return;
		} else if(this.mass == -1){
			// If this actor does not move,
			//   let other actors resolve their collisions with this
			return;
		}
		var collided = false;
		for(var i = 0; i < actors.length; ++i){
		    if(actors[i].id == this.id || !actors[i].blocking){
				// If this actor is being tested with itself
				// Or the actor is not blocking
				continue;
			}
			if(actors[i].bounding_box.intersects(this.bounding_box)){
				// If the actor's bounding box and the block intersect
				// Check the previous relative position and un-intersect the actor
				// Check where the actor was before the recent update
				// and press them against the wall
				collided = true;
				var intersection_switch = 
					actors[i].old_bb.detect_intersection(this.old_bb);

				switch(intersection_switch){
					// Set this to be pressed against the immovable actor
				case block_relative_position.left:
					this.set_position(new Vector(actors[i].bounding_box.position.x - this.size.x, 
						this.position.y));
					break;
				case block_relative_position.right:	
					this.set_position(new Vector(actors[i].bounding_box.position.x + 
						actors[i].bounding_box.size.x, this.position.y));
					break;
				case block_relative_position.above:
					this.set_position(new Vector(this.position.x, 
						actors[i].bounding_box.position.y - this.size.y));
					break;
				case block_relative_position.below:
					this.set_position(new Vector(this.position.x, actors[i].bounding_box.position.y +
						actors[i].bounding_box.size.y));
					break;
				}

				if(actors[i].mass == -1){
					// If the actor is an immovable object and this
					//   should be stopped in it's tracks

					switch(intersection_switch){
						// Stop this along the intersection axis
					case block_relative_position.left:
					case block_relative_position.right:
						// Stop along x axis
						this.impulse_momentum(new Vector(-1.0 * this.get_momentum().x, 0.0));
						break;
					case block_relative_position.above:
					case block_relative_position.below:
						// Stop along y
						this.impulse_momentum(new Vector(0.0, -1.0 * this.get_momentum().y));
						break;
					default:
						break;
					}
				} 
				else {
					var total_mass = this.mass + actors[i].mass;
					var this_mass_per = this.mass / total_mass;
					var actor_mass_per = actors[i].mass / total_mass;
					var total_momentum = this.get_momentum().add(actors[i].get_momentum());
					
					var tmp_this_momentum = this.get_momentum();
					var tmp_actor_momentum = actors[i].get_momentum();
					this.impulse_momentum(this.get_momentum().scale(-1.0));
					actors[i].impulse_momentum(actors[i].get_momentum().scale(-1.0));

					switch(intersection_switch){
						case block_relative_position.left:
						case block_relative_position.right:
							// Do momentum on x
							// Both actors get their share of momentum, based on mass
							this.impulse_momentum(new Vector(total_momentum.x * this_mass_per,
								tmp_this_momentum.y));
							actors[i].impulse_momentum(new Vector(total_momentum.x * actor_mass_per,
								tmp_actor_momentum.y));
							
							break;
						case block_relative_position.above:
						case block_relative_position.below:
							// Do momentum on y
							// Both actors get's their share of momentum, based on mass
							this.impulse_momentum(new Vector(tmp_this_momentum.x,
								total_momentum.y * this_mass_per));
							actors[i].impulse_momentum(new Vector(tmp_actor_momentum.x,
								total_momentum.y * actor_mass_per));
							
							break;
						default:
							break;
					}
				}
	    	}
		}
		if(collided == false){
			this.old_bb = new Block(this.bounding_box.position, this.bounding_box.size);
		}
    }
}

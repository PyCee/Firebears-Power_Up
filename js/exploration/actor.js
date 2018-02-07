var FORCE_DUE_TO_GRAVITY = 9.8;

class Actor extends Renderable {
    constructor (position, size, animation, draw_priority=1, blocking=true,
		 mass=1.0, update=function(){}) {
	super(position, size, animation, draw_priority);
	this.bounding_box = new Block(this.display_position, this.size);
	this.blocking = blocking; // Replace blocking with block-levels
	this.last_position = position;
	this.acceleration = new Vector(0.0, 0.0);
	this.velocity = new Vector(0.0, 0.0);
	this.mass = mass;
	this.update = update;
	}
	// display () { // uncomment this function to see last_positions
	//     ctx.fillStyle = "#ffffff";
	// 	ctx.fillRect(this.last_position.x*150,this.last_position.y*150,
	// 		this.size.x*150,this.size.y*150);
	// }
	is_moveable () {
		return this.mass != -1;
	}
    update (delta_s) {}
    set_position (position) {
		this.display_position = position;
		this.bounding_box = new Block(this.display_position, this.size);
	}
	get_force () {return this.acceleration.scale(this.mass);}
	impulse_force (force) {
		this.acceleration = this.acceleration.add(force.scale(1.0 / this.mass));
	}
	get_momentum () {return this.velocity.scale(this.mass);}
	impulse_momentum (momentum) {
		this.velocity = this.velocity.add(momentum.scale(1.0 / this.mass));
	}
	get_last_bounding_box () {
		return new Block(this.last_position, this.size);
	}
	step_x () {
		if(!this.is_moveable()){return;}
		this.velocity.x = this.velocity.x + this.acceleration.x * PHYSICS.UPDATE_DELTA_S;
		this.set_position(this.last_position.add(new Vector(this.velocity.x * PHYSICS.UPDATE_DELTA_S, 0.0)));
	}
	step_y () {
		if(!this.is_moveable()){return;}
		this.velocity.y = this.velocity.y +
			(this.acceleration.y + FORCE_DUE_TO_GRAVITY) * PHYSICS.UPDATE_DELTA_S;
		this.set_position(this.last_position.add(new Vector(0.0, this.velocity.y * PHYSICS.UPDATE_DELTA_S)));
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
		var should_update_last_position = true;
		for(var i = 0; i < actors.length; ++i){
		    if(actors[i].id == this.id || !actors[i].blocking){
				// If this actor is being tested with itself
				// Or the actor is not blocking
				continue;
			}
			if(this.bounding_box.intersects(actors[i].bounding_box)){
				// If the actor's bounding box and this bounding box intersect
				
				// Don't update last_position as it would conflict with other actors
				should_update_last_position = false;

				var total_momentum = this.get_momentum().add(actors[i].get_momentum());
				var total_mass = this.mass + actors[i].mass;
				var this_mass_per = 0.0;
				var actor_mass_per = 0.0;
				if(actors[i].is_moveable()){
					this_mass_per = this.mass / total_mass;
					actor_mass_per = actors[i].mass / total_mass;
				}

				var intersection_switch = 
					actors[i].get_last_bounding_box().detect_intersection(this.get_last_bounding_box());
				
				switch(intersection_switch){
				case RELATIVE_POSITION.LEFT:
					// Position this to the left of the actor
					this.set_position(new Vector(actors[i].bounding_box.position.x - this.size.x, 
						this.display_position.y));
					intersection_switch = RELATIVE_POSITION.HORIZONTAL;
					break;
				case RELATIVE_POSITION.RIGHT:
					// Position this to the right of the actor
					this.set_position(new Vector(actors[i].bounding_box.position.x + 
						actors[i].bounding_box.size.x, this.display_position.y));
					intersection_switch = RELATIVE_POSITION.HORIZONTAL;
					break;
				case RELATIVE_POSITION.ABOVE:
					// Position this above the actor
					this.set_position(new Vector(this.display_position.x, 
						actors[i].bounding_box.position.y - this.size.y));
					intersection_switch = RELATIVE_POSITION.VERTICAL;
					break;
				case RELATIVE_POSITION.BELOW:
					// Position this below the actor
					this.set_position(new Vector(this.display_position.x, actors[i].bounding_box.position.y +
						actors[i].bounding_box.size.y));
					intersection_switch = RELATIVE_POSITION.VERTICAL;
					break;
				case RELATIVE_POSITION.INTERSECTS:
				default:
					console.log("not applying collision response");
					break;
				}
				switch(intersection_switch){
				case RELATIVE_POSITION.HORIZONTAL:
					// Handle momentum on the x-axis
					// Zero out momentum on the x-axis
					this.impulse_momentum(new Vector(-1.0 * this.get_momentum().x, 0.0));
					actors[i].impulse_momentum(new Vector(-1.0 * actors[i].get_momentum().x, 0.0));
					// Both actors get their share of x-axis momentum, based on mass
					this.impulse_momentum(new Vector(total_momentum.x * this_mass_per, 0.0));
					actors[i].impulse_momentum(new Vector(total_momentum.x * actor_mass_per, 0.0));
					break;
				case RELATIVE_POSITION.VERTICAL:
					// Handle momentum on the y-axis
					// Zero out momentum on the y-axis
					this.impulse_momentum(new Vector(0.0, -1.0 * this.get_momentum().y));
					actors[i].impulse_momentum(new Vector(0.0, -1.0 * actors[i].get_momentum().y));
					// Both actors get's their share of y-axis momentum, based on mass
					this.impulse_momentum(new Vector(0.0, total_momentum.y * this_mass_per));
					actors[i].impulse_momentum(new Vector(0.0, total_momentum.y * actor_mass_per));
					break;
				default:
					break;
				}
			}
			if(this.bounding_box.intersects(actors[i].get_last_bounding_box())){
				// Don't update last_position as it would conflict with other actors
				should_update_last_position = false;
			}
		}
		if(should_update_last_position){
			this.last_position = this.display_position.copy();
		}
    }
}

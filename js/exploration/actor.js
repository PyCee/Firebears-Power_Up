var FORCE_DUE_TO_GRAVITY = 9.8;

class Actor extends Renderable {
    constructor (position, size, animation, draw_priority=1, block_layers=[-1],
		 mass=1.0, ai_update=function(){}) {
	super(position, size, animation, draw_priority);
	this.bounding_box = new Block(this.display_position, this.size);

	// Block Layers are how collisions are organized.
	// Each actor has a list of block layers.
	// That actor will test for collision with all
	//   actors that share any block layer number
	// Special cases include:
	//	 A first list-element of -1 = Behaves as if on every block layer
	//   An empty block layer list = Will not collide with anything
	this.block_layers = block_layers;
	this.last_position = position;
	this.acceleration = new Vector(0.0, 0.0);
	this.velocity = new Vector(0.0, 0.0);

	// Actor's mass in (units)
	// A mass of -1 means the actor is immovable
	this.mass = mass;
	this.ai_update = ai_update;
	this.friction_sources = [];
	}
	// display () { // Uncomment this function to see last_positions
	//     ctx.fillStyle = "#ffffff";
	// 	ctx.fillRect(this.last_position.x*150,this.last_position.y*150,
	// 		this.size.x*150,this.size.y*150);
	// }
	set_ai (fun) {
		this.ai_update = fun;
	}
	freeze () {
		this.mass = -1;
		this.last_position = this.display_position;
	}
	set_block_layers (block_layers=[]) {
		this.block_layers = block_layers;
	}
	is_moveable () {
		return this.mass != -1;
	}
	ai_update (delta_s) {}
	set_absolute_position (position) {
		// Set position regardless of physics
		this.display_position = position;
		this.bounding_box = new Block(this.display_position, this.size);
		this.last_position = position;
	}
    set_position (position) {
		// Set position, but not the phyics-related last_position
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

		// Apply friction
		for(var i =0; i < this.friction_sources.length; ++i){
			var applied_frict = this.friction_sources[i].x * 0.10;
			if(applied_frict * applied_frict > this.velocity.x * this.velocity.x){
				this.velocity.x = 0.0;
			} else {
				this.velocity.x -= applied_frict;
			}
		}
		// Reset friction sources
		this.friction_sources = [];

		this.set_position(this.last_position.add(new Vector(this.velocity.x * PHYSICS.UPDATE_DELTA_S, 0.0)));
	}
	step_y () {
		if(!this.is_moveable()){return;}
		this.velocity.y = this.velocity.y +
			(this.acceleration.y + FORCE_DUE_TO_GRAVITY) * PHYSICS.UPDATE_DELTA_S;
		this.set_position(new Vector(this.display_position.x, 
			this.last_position.y + this.velocity.y * PHYSICS.UPDATE_DELTA_S));
	}
	resolve_collisions (actors) {
		if(this.mass == -1){
			// If this actor does not move,
			//   let other actors resolve their collisions with this
			return;
		} else if (this.block_layers.length == 0){
			// If this actor does not collide with anything
			return;
		}
		var should_update_last_position = true;
		for(var i = 0; i < actors.length; ++i){
			// For each actor
		    if(actors[i].id == this.id){
				// If this actor is being tested with itself
				continue;
			}
			if(actors[i].block_layers.length == 0){
				// If the actor does not collide with anything
				continue;
			}
			var share_block_layer = false;
			share_block_layer = this.block_layers[0] != -1 || actors[i].block_layers[0] != -1;
			// Assign share_block_layer to true if either actor collides with all other actors
			for(var j = 0; j < this.block_layers.length; ++j){
				// For each block layer in this
				for(var k = 0; k < actors[i].block_layers.length; ++k){
					// For each block layer in actor[i]
					if(this.block_layers[j] == actors[i].block_layers[k]){
						// If the layer is shared by both actors
						share_block_layer = true;
						break;
					}
				}
			}
			if(!share_block_layer){
				// If the actors don't share a block layer
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

				// Best one so far
				var intersection_switch = 
					actors[i].get_last_bounding_box().detect_intersection(this.get_last_bounding_box());
				var orig_intersection_switch = intersection_switch;
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
					console.log("Actor.resolve_collisions intersection_switch not set correctly");
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
				// Setup friction between the two actors
				var frict_diff = this.velocity.subtract(actors[i].velocity);
				if(orig_intersection_switch == RELATIVE_POSITION.ABOVE){
					this.friction_sources.push(frict_diff);
				} else if(orig_intersection_switch == RELATIVE_POSITION.BELOW){
					actors[i].friction_sources.push(frict_diff.scale(-1.0));
				} else {
					this.friction_sources.push(frict_diff);
					actors[i].friction_sources.push(frict_diff.scale(-1.0));
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

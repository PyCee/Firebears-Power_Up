const FORCE_DUE_TO_GRAVITY = 9.8;

class Physics_State {
    constructor (position, mass=-1, collision_boxes=[]) {
        this.position = position;
        this.last_position = this.position;
        // Physics states's mass in (units)
        // A mass of -1 means the physics state is immovable
		this.mass = mass;
		// List of all collision boxes this physics_state uses
		this.collision_boxes = collision_boxes;
		this.update_collisison_boxes_parent_position();
        
        this.acceleration = new Vector(0.0, 0.0);
        this.velocity = new Vector(0.0, 0.0);
        this.friction_sources = [];
	}
	get_last_collision_box (box_index) {
		if(box_index >= this.collision_boxes.length){
			console.log("ERROR::Attempting to get box of index \'" + box_index + "/':out of range");
			return null;
		}
		var last_box = new Collision_Box(this.collision_boxes[box_index].size,
			this.collision_boxes[box_index].offset, 
			this.collision_boxes[box_index].block_layers);
		last_box.set_parent_position(this.last_position);
		return last_box;
	}
	update_collisison_boxes_parent_position () {
		for(var i = 0; i < this.collision_boxes.length; ++i){
			this.collision_boxes[i].set_parent_position(this.position);
		}
	}
	freeze () {
		this.mass = -1;
		this.acceleration = new Vector(0.0, 0.0);
		this.velocity = new Vector(0.0, 0.0);
	}
    set_position (position) {
		this.position = position;
		this.update_collisison_boxes_parent_position();
	}
	set_absolute_position (position) {
		this.position = position;
		this.last_position = position;
		for(var i = 0; i < this.collision_boxes.length; ++i){
			this.collision_boxes[i].set_parent_position(this.position);
		}
	}
    is_movable () {return this.mass != -1;}
    get_force () {return this.acceleration.scale(this.mass);}
	impulse_force (force) {
		this.acceleration = this.acceleration.add(force.scale(1.0 / this.mass));
	}
	get_momentum () {return this.velocity.scale(this.mass);}
	impulse_momentum (momentum) {
		this.velocity = this.velocity.add(momentum.scale(1.0 / this.mass));
	}
    step_x () {
		if(!this.is_movable()){return;}
		this.velocity.x = this.velocity.x + this.acceleration.x * PHYSICS.UPDATE_DELTA_S;
		// console.log(this.acceleration.x);
		// Apply friction
		for(var i = 0; i < this.friction_sources.length; ++i){
			var applied_frict = this.friction_sources[i].x * 0.10;
			if(applied_frict * applied_frict > this.velocity.x * this.velocity.x){
                // Square the compared values to compare positive magnitude
				this.velocity.x = 0.0;
			} else {
				this.velocity.x -= applied_frict;
			}
		}
		// Reset friction sources
		this.friction_sources = [];
		this.set_position(new Vector(this.last_position.x + this.velocity.x * PHYSICS.UPDATE_DELTA_S,
			this.last_position.y));
	}
	step_y () {
		if(!this.is_movable()){return;}
		this.velocity.y = this.velocity.y +
			(this.acceleration.y + FORCE_DUE_TO_GRAVITY) * PHYSICS.UPDATE_DELTA_S;
		this.set_position(new Vector(this.last_position.x, 
			this.last_position.y + this.velocity.y * PHYSICS.UPDATE_DELTA_S));
    }
	intersects (phsyics_state) {
		for(var i = 0; i < this.collision_boxes.length; ++i){
			for(var j = 0; j < phsyics_state.collision_boxes.length; ++j){
				if(this.collision_boxes[i].intersects(phsyics_state.collision_boxes[j])){
					return true;
				}
			}
		}
		return false;
	}
    resolve_collisions (physics_states) {
		if(this.mass == -1){
			// If this physics state does not move,
			//   let other actors resolve their collisions with this
			return;
		}
		var should_update_last_position = true;
		for(var i = 0; i < this.collision_boxes.length; ++i){
			var this_collision_box = this.collision_boxes[i];
			for(var j = 0; j < physics_states.length; ++j){
				var physics_state = physics_states[j];
				for(var k = 0; k < physics_state.collision_boxes.length; ++k){
					var collision_box = physics_state.collision_boxes[k];
            		// For each collision box
            		if(!this_collision_box.share_block_layer(collision_box)){
						// If the collision boxes don't share a collision layer
            		    continue;
					}
					if(this_collision_box.intersects(physics_state.get_last_collision_box(k))){
						should_update_last_position = false;
					}
					if(!this_collision_box.intersects(collision_box)){
						// If this_collision_box and collision_box don't intersect
						continue;
					}
					// Don't update last_position as it could conflict with other actors
					should_update_last_position = false;

					var total_momentum = this.get_momentum().add(physics_state.get_momentum());
					var total_mass = this.mass + physics_state.mass;
					var this_mass_per = 0.0;
					var physics_state_mass_per = 0.0;
					if(physics_state.is_movable()){
						this_mass_per = this.mass / total_mass;
						physics_state_mass_per = physics_state.mass / total_mass;
					}

					var intersection_switch =
						physics_state.get_last_collision_box(k).detect_positioning(this.get_last_collision_box(i));
					var momentum_handle_switch = -1;
					switch(intersection_switch){
					case COLLISION_BOX_STATE.LEFT:
						// Position this to the left of the collision_box
						var new_x = collision_box.get_position().x - this_collision_box.size.x;
						this.set_position(new Vector(-1.0 * this_collision_box.offset.x + new_x,
							this.position.y));
						momentum_handle_switch = COLLISION_BOX_STATE.HORIZONTAL;
						break;
					case COLLISION_BOX_STATE.RIGHT:
						// Position this to the right of the collision_box
						var new_x = collision_box.get_position().x + collision_box.size.x;
						this.set_position(new Vector(-1.0 * this_collision_box.offset.x + new_x,
							this.position.y));
						momentum_handle_switch = COLLISION_BOX_STATE.HORIZONTAL;
						break;
					case COLLISION_BOX_STATE.ABOVE:
						// Position this above the collision_box
						var new_y = collision_box.get_position().y - this_collision_box.size.y;
						this.set_position(new Vector(this.position.x, -1.0 * this_collision_box.offset.y + new_y));
						momentum_handle_switch = COLLISION_BOX_STATE.VERTICAL;
						break;
					case COLLISION_BOX_STATE.BELOW:
						// Position this below the collision_box
						var new_y = collision_box.get_position().y + collision_box.size.y;
						this.set_position(new Vector(this.position.x, -1.0 * this_collision_box.offset.y + new_y));
						momentum_handle_switch = COLLISION_BOX_STATE.VERTICAL;
						break;
					case COLLISION_BOX_STATE.INTERSECTS:
					default:
						console.log("physics_state.resolve_collisions intersection_switch not set correctly");
						break;
					}
					switch(momentum_handle_switch){
					case COLLISION_BOX_STATE.HORIZONTAL:
						// Add_Debug_String(total_momentum.str());
						// Add_Debug_String(total_mass);
						// Handle momentum on the x-axis
						// Zero out momentum on the x-axis
						this.impulse_momentum(new Vector(-1.0 * this.get_momentum().x, 0.0));
						physics_state.impulse_momentum(new Vector(-1.0 * physics_state.get_momentum().x, 0.0));
						// Both physics_states get their share of x-axis momentum, based on mass
						this.impulse_momentum(new Vector(total_momentum.x * this_mass_per, 0.0));
						physics_state.impulse_momentum(new Vector(total_momentum.x * physics_state_mass_per, 0.0));
						// Add_Debug_String(physics_state.velocity.str());
						break;
					case COLLISION_BOX_STATE.VERTICAL:
						// Handle momentum on the y-axis
						// Zero out momentum on the y-axis
						this.impulse_momentum(new Vector(0.0, -1.0 * this.get_momentum().y));
						physics_state.impulse_momentum(new Vector(0.0, -1.0 * physics_state.get_momentum().y));
						// Both physics_states get's their share of y-axis momentum, based on mass
						this.impulse_momentum(new Vector(0.0, total_momentum.y * this_mass_per));
						physics_state.impulse_momentum(new Vector(0.0, total_momentum.y * physics_state_mass_per));
						break;
					default:
						break;
					}
					// Setup friction between the two physics_states
					var frict_diff = this.velocity.subtract(physics_state.velocity);
					if(intersection_switch == COLLISION_BOX_STATE.ABOVE){
						this.friction_sources.push(frict_diff);
					} else if(intersection_switch == COLLISION_BOX_STATE.BELOW){
						physics_state.friction_sources.push(frict_diff.scale(-1.0));
					} else {
						this.friction_sources.push(frict_diff);
						physics_state.friction_sources.push(frict_diff.scale(-1.0));
					}
				}
			}
		}
		if(should_update_last_position){
			this.set_absolute_position(this.position);
		}
    }
}
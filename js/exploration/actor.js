class Actor extends Renderable {
	constructor (position, size, animation, draw_priority=1,
		ai_update=function(delta_s){}, mass=-1, collision_boxes=[]) {
		super(position, size, animation, draw_priority);
		this.physics_state = new Physics_State(position, mass, collision_boxes, this.id);
		this.ai_update = ai_update;
	}
	set_ai (fun) {
		this.ai_update = fun;
	}
	set_ghost (ghost=true) {
		for(var i = 0; i < this.physics_state.collision_boxes.length; ++i){
			if(ghost){
				this.physics_state.collision_boxes[i].set_block_layers([]);
			} else {
				this.physics_state.collision_boxes[i].reset_block_layers();
			}
		}
	}
	set_freeze (freeze=true) {
		this.physics_state.freeze(freeze);
	}
	set_position (position) {
		this.physics_state.set_position(position);
		this.position = this.physics_state.position;
	}
	set_absolute_position (position) {
		this.set_position(position);
		this.physics_state.set_absolute_position(position);
	}
	get_force () {return this.physics_state.get_force();}
	impulse_force (force) {
		this.physics_state.impulse_force(force);
	}
	get_momentum () {return this.physics_state.get_momentum()}
	impulse_momentum (momentum) {
		this.physics_state.impulse_momentum(momentum);
	}
	resolve_collisions (actors) {
		var physics_states = [];
		for(var i = 0; i < actors.length; ++i){
			physics_states.push(actors[i].physics_state);
		}
		this.physics_state.resolve_collisions(physics_states);
		this.position = this.physics_state.position;
    }
}
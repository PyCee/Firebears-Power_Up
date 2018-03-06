class Actor extends Renderable {
	constructor (position, size, animation, draw_priority=1,
		ai_update=function(delta_s){}, mass=-1, collision_boxes=[]) {
	super(position, size, animation, draw_priority);
	this.physics_state = new Physics_State(position, mass, collision_boxes);
	this.ai_update = ai_update;
	}
	// display () { // Uncomment to display last position boxes
	// 	ctx.fillStyle = "#ffffff";
	// 	var scale = 50;//1920 / curr_scene.inside_width;
	// 	ctx.fillRect(this.physics_state.last_position.x * scale,
	// 		this.physics_state.last_position.y * scale,
	// 		this.size.x * scale, this.size.y * scale)
    // }
	set_ai (fun) {
		this.ai_update = fun;
	}
	set_ghost () {
		for(var i = 0; i < this.physics_state.collision_boxes.length; ++i){
			this.physics_state.collision_boxes[i].set_block_layers([]);
		}
	}
	set_freeze () {
		this.physics_state.freeze();
	}
	set_position (position) {
		this.physics_state.set_position(position);
		this.position = this.physics_state.position;
	}
	set_absolute_position (position) {
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
			if(this.id == actors[i].id){
				// If this and the current actor are the same
				//   Don't test, are you crazy?
				continue;
			}
			physics_states.push(actors[i].physics_state);
		}
		this.physics_state.resolve_collisions(physics_states);
		this.set_position(this.physics_state.position);
    }
}
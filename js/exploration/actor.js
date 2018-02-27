class Actor extends Renderable {
	constructor (position, size, animation, draw_priority=1,
		ai_update=function(delta_s){}, mass=-1, collision_boxes=[]) {
	super(position, size, animation, draw_priority);
	// this.bounding_box = new Block(this.display_position, this.size); 

	// The position attribute of this.collision_boxes is relative to this.position
	// this.collision_boxes = collision_boxes;

	this.physics_state = new Physics_State(position, mass, collision_boxes);
	// this.block_layers = block_layers;
	// this.last_position = position;
	// this.acceleration = new Vector(0.0, 0.0);
	// this.velocity = new Vector(0.0, 0.0);
	// this.mass = mass;
	this.ai_update = ai_update;
	// this.friction_sources = [];
	}
	set_ai (fun) {
		this.ai_update = fun;
	}
	set_position (position) {
		this.physics_state.set_position(position);
		this.position = position;
	}
	set_absolute_position (position) {
		this.physics_state.set_absolute_position(position);
		this.position = position;
	}
	step_x () {
		this.physics_state.step_x();
		this.position.x = this.physics_state.position.x;
	}
	step_y () {
		this.physics_state.step_x();
		this.position.y = this.physics_state.position.y;
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
			if(!this.physics_state.intersects(actors[i].physics_state)){
				continue;
			}
			physics_states.push(actors[i].physics_state);
		}
		this.physics_state.resolve_collisions(physics_states);
		this.set_position(this.physics_state.position);
    }
}

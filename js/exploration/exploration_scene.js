var physics_time_accum = 0;

var exploration = {
    // The scene that will be updated for each map
    scene: new Scene("Exploration", 1.0, function(){
	physics_time_accum = 0;
	}, null,
	function(delta_s){
		// Update all actors
		for(var i = 0; i < exploration.map.actors.length; ++i){
			exploration.map.actors[i].ai_update(delta_s);
		}
		// Physics
		physics_time_accum += delta_s;
		while(physics_time_accum >= PHYSICS.UPDATE_DELTA_S){
			// Step actor physics
			for(var i = 0; i < exploration.map.actors.length; ++i){
				// Update horizontal positions
				exploration.map.actors[i].physics_state.step_x(PHYSICS.UPDATE_DELTA_S);
			}
			for(var i = 0; i < PHYSICS.ITERATIONS; ++i){
				for(var j = 0; j < exploration.map.actors.length; ++j){
					// Resolve collisions
					exploration.map.actors[j].resolve_collisions(exploration.map.actors);
				}
			}
			for(var i = 0; i < exploration.map.actors.length; ++i){
				// Update vertical positions
				exploration.map.actors[i].physics_state.step_y(PHYSICS.UPDATE_DELTA_S);
			}
			for(var i = 0; i < PHYSICS.ITERATIONS; ++i){
				for(var j = 0; j < exploration.map.actors.length; ++j){
					// Resolve collisions
					exploration.map.actors[j].resolve_collisions(exploration.map.actors);
				}
			}
			
	    	physics_time_accum -= PHYSICS.UPDATE_DELTA_S;
		}	
		//TODO: interpolate between the current and the next physics state
		
		for(var i = 0; i < exploration.map.events.length; ++i){
		    exploration.map.events[i].test();
		}
    }),
    set_map: function (map) {
	exploration.map = map;
    },

    // Reference to the data that makes up the current map
    map: null
};
var robot = new Robot(new Vector(0.0, 0.0), new Vector(1.0, 0.8),
				new Animation("Robot Anim", Sprite.red, [[0,0]], 1, -1),
				4, 1, 
				[
					new Collision_Box(new Vector(1.0, 0.8), new Vector(0.0, 0.0), [-1])
				], ALLIENCE.ALLY);
var ROBOT_MOVE_SPEED = 15.0 * robot.physics_state.mass;

// Add basic control for exploration
exploration.scene.user_input.add_keyboard_event("a", "press", function(){
	robot.turn_left();
	robot.physics_state.impulse_force(new Vector(-1.0 * ROBOT_MOVE_SPEED, 0.0));
}, true);
exploration.scene.user_input.add_keyboard_event("a", "release", function(){
	robot.physics_state.impulse_force(new Vector(1.0 * ROBOT_MOVE_SPEED, 0.0));
});
exploration.scene.user_input.add_keyboard_event("d", "press", function(){
	robot.turn_right();
	robot.physics_state.impulse_force(new Vector(1.0 * ROBOT_MOVE_SPEED, 0.0));
}, true);
exploration.scene.user_input.add_keyboard_event("d", "release", function(){
	robot.physics_state.impulse_force(new Vector(-1.0 * ROBOT_MOVE_SPEED, 0.0));
});
exploration.scene.user_input.add_keyboard_event("q", "press", function(){
	// If the robot has a power block and is positioned by a switch
	robot.place();
});
exploration.scene.user_input.add_keyboard_event("t", "press", function(){
	// tmp pick up power cube
	robot.pickup();
	// for(var i = 0; i < cube_stack_id_list.length; ++i){
	// 	var cube_stack = exploration.scene.get_renderable_from_id(cube_stack_id_list[i]);
	// 	if(cube_stack.physics_state.intersects(robot.physics_state)){
	// 		console.log("get cube");
	// 		var cube = new Power_Cube(new Vector(0.0, 0.0));
	// 		robot.pickup(cube);
	// 	}
	// }
});
exploration.scene.user_input.add_keyboard_event("e", "press", function(){
	robot.launch();
});

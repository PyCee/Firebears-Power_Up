var physics_time_accum = 0;

var exploration = {
    // The scene that will be updated for each map
    scene: new Scene("Exploration", 1.0, function(){
	physics_time_accum = 0;
    }, function(delta_s){

	for(var i = 0; i < exploration.map.actors.length; ++i){
		exploration.map.actors[i].update();
	}
	// Physics
	physics_time_accum += delta_s;
	while(physics_time_accum >= PHYSICS.UPDATE_DELTA_S){
		// Step actor physics
		for(var i = 0; i < exploration.map.actors.length; ++i){
			// Update horizontal positions
			exploration.map.actors[i].step_x();
		}
		for(var i = 0; i < PHYSICS.ITERATIONS; ++i){
			for(var j = 0; j < exploration.map.actors.length; ++j){
				// Resolve collisions
				exploration.map.actors[j].resolve_collisions(exploration.map.actors);
			}
		}
		for(var i = 0; i < exploration.map.actors.length; ++i){
			// Update vertical positions
			exploration.map.actors[i].step_y();
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
			  new Animation(Sprite.red, "Robot Move", [[0,0]], 1, -1),
			  6, 10);
var ROBOT_MOVE_SPEED = 15.0 * robot.mass;

// Add basic control for exploration
exploration.scene.user_input.add_keyboard_event("a", "press", function(){
	robot.turn_left();
	robot.impulse_force(new Vector(-1.0 * ROBOT_MOVE_SPEED, 0.0));
}, true);
exploration.scene.user_input.add_keyboard_event("a", "release", function(){
	robot.impulse_force(new Vector(1.0 * ROBOT_MOVE_SPEED, 0.0));
});
exploration.scene.user_input.add_keyboard_event("d", "press", function(){
	robot.turn_right();
	robot.impulse_force(new Vector(1.0 * ROBOT_MOVE_SPEED, 0.0));
}, true);
exploration.scene.user_input.add_keyboard_event("d", "release", function(){
	robot.impulse_force(new Vector(-1.0 * ROBOT_MOVE_SPEED, 0.0));
});
exploration.scene.user_input.add_keyboard_event("q", "press", function(){
	// If the robot has a power block and is positioned by a switch
	// place block
});
exploration.scene.user_input.add_keyboard_event("e", "press", function(){
	robot.launch();
});

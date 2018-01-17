var physics_time_accum = 0;

var exploration = {
    // The scene that will be updated for each map
    scene: new Scene("Exploration", 1.0, function(){
	physics_time_accum = 0;
    }, function(delta_s){
	// Physics
	physics_time_accum += delta_s;
	while(physics_time_accum >= PHYSICS_UPDATE_DELTA_S){
	    
	    // Step actor physics
	    for(var i = 0; i < exploration.map.actors.length; ++i){
		exploration.map.actors[i].step_physics(exploration.map.actors);
	    }
	    
	    physics_time_accum -= PHYSICS_UPDATE_DELTA_S;
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
var robot = new Actor(new Vector(0.0, 0.0), new Vector(1.0, 0.8),
			  new Animation(Sprite.red, "Robot Move", [[0,0]], 1, -1),
			  2, true, true, function(){});
var ROBOT_MOVE_SPEED = 2.0;

// Add basic control for exploration

exploration.scene.user_input.add_keyboard_event("a", "press", function(){
    robot.velocity.x -= ROBOT_MOVE_SPEED;
}, true);
exploration.scene.user_input.add_keyboard_event("a", "release", function(){
    robot.velocity.x += ROBOT_MOVE_SPEED;
});
exploration.scene.user_input.add_keyboard_event("d", "press", function(){
    robot.velocity.x += ROBOT_MOVE_SPEED;
}, true);
exploration.scene.user_input.add_keyboard_event("d", "release", function(){
    robot.velocity.x -= ROBOT_MOVE_SPEED;
});

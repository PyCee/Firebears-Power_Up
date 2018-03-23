var physics_time_accum = 0;

var exploration = {
    // The scene that will be updated for each map
    scene: new Scene("Exploration", 1.0, function(){
	physics_time_accum = 0;
	}, null,
	function(delta_s){
		check_gamepad_input();
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
				new Animation("Robot Anim", Sprite.upchuck, [[0,0]], 1, -1),
				new Animation("Robot Anim", Sprite.upchuck, [[1, 0]], 1, -1),
				4, 10, 
				[
					new Collision_Box(new Vector(1.0, 0.2), new Vector(0.0, 0.6), [-1])
				], ALLIENCE_TYPE.BLUE);
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
	robot.place();
});
exploration.scene.user_input.add_keyboard_event("t", "press", function(){
	robot.pickup();
});
exploration.scene.user_input.add_keyboard_event("e", "press", function(){
	robot.launch();
});
exploration.scene.user_input.add_keyboard_event("p", "press", function(){
	end_tutorial();
});

// Makeshift event response for arcade controls
var Gamepad_Index = -1;
function get_gamepad () {
	if(Gamepad_Index == -1){
		return null;
	} else {
		return navigator.getGamepads()[Gamepad_Index];
	}
}
class Gamepad_Button {
	constructor (index, fun) {
		this.index = index;
		this.fun = fun;
		this.pressed = false;
	}
}
Gamepad_Buttons = [
	new Gamepad_Button(0, function(){robot.pickup();}),
	new Gamepad_Button(1, function(){robot.launch();}),
	new Gamepad_Button(2, function(){robot.place();})
];
window.addEventListener("gamepadconnected", function(event) {
	Gamepad_Index = event.gamepad.index;
	console.log("Connected gamepad: " + get_gamepad().id);
});
window.addEventListener("gamepaddisconnected", function(event) {
	console.log("disconnected gamepad");
});
function check_gamepad_input () {
	if(get_gamepad() != null){
		for(var i = 0; i < get_gamepad().buttons.length; ++i){
			// Add_Temp_Debug_String("b" + i + ": " + get_gamepad().buttons[i].pressed);
			for(var j = 0; j < Gamepad_Buttons.length; ++j){
				if(i == Gamepad_Buttons[j].index){
					if(get_gamepad().buttons[i].pressed != Gamepad_Buttons[j].pressed){
						Gamepad_Buttons[j].pressed = !Gamepad_Buttons[j].pressed;
						if(Gamepad_Buttons[j].pressed){
							Gamepad_Buttons[j].fun();
						}
					}
				}
			}
		}
		for(var i = 0; i < get_gamepad().axes.length; ++i){
			// Add_Temp_Debug_String("a" + i + ": " + get_gamepad().axes[i].valueOf());

			var val = get_gamepad().axes[i].valueOf();
			if(val * val <= 0.3){
				continue;
			}
			if(val < 0.0){
				robot.turn_left();
			} else {
				robot.turn_right();
			}
			var move_speed = val * ROBOT_MOVE_SPEED * 0.03;
			switch(i){
			case 0:
				robot.physics_state.impulse_momentum(new Vector(move_speed, 0.0));
				break;
			case 1:
				break;
			default:
				break;
			}
		}
	}
}
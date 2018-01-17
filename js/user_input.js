var keys_down = [];
class Key_Callback {
    constructor (callback, hangover=false) {
	this.callback = callback;
	// hangover is whether or not press_callback will be called when the key is
	//   held while the User_Input_Group is enabled
	this.hangover = hangover;
    }
}
class Key_Callback_Group {
    constructor () {
	this.press_callbacks = [];
	this.release_callbacks = [];
    }
    press_callback () {
	for(var i = 0; i < this.press_callbacks.length; ++i){
	    this.press_callbacks[i].callback();
	}
    }
    release_callback () {
	for(var i = 0; i < this.release_callbacks.length; ++i){
	    this.release_callbacks[i].callback();
	}
    }
    hangover_press_callback () {
	for(var i = 0; i < this.press_callbacks.length; ++i){
	    if(this.press_callbacks[i].hangover){
		this.press_callbacks[i].callback();
	    }
	}
    }
}
class User_Input_Group {
    constructor () {
	this.keyboard = [];
    }
    add_keyboard_event (key, action, callback, hangover=false) {
	var key_value = key.toUpperCase().charCodeAt(0);
	while(keys_down.length <= key_value){
	    keys_down.push(false);
	}
	while(this.keyboard.length <= key_value){
	    this.keyboard.push(new Key_Callback_Group());
	}
	switch(action){
	case "press":
	    this.keyboard[key_value].press_callbacks.push(new Key_Callback(callback,
									   hangover));
	    break;
	case "release":
	    this.keyboard[key_value].release_callbacks.push(new Key_Callback(callback,
									     hangover));
	    break;
	default:
	    console.log("Attempting to assign callback to undefined keyboard action");
	    break;
	}
    }
    bind () {
	curr_user_input_group = this;
	// Key press events for keys that are held down
	for(var i = 0; i < this.keyboard.length; ++i){
	    // For each key
	    if(keys_down[i]){
		// If the key is currently held down and
		//   hangover is enabled for this key
		this.keyboard[i].hangover_press_callback();
	    }
	}
    }
    release () {
	// Key release events for keys that are held down
	for(var i = 0; i < this.keyboard.length; ++i){
	    // For each key
	    if(keys_down[i]){
		// If the key is currently held down
		this.keyboard[i].release_callback();
	    }
	}
    }
}
var curr_user_input_group = new User_Input_Group();
function handle_press_user_input (event) {
    while(keys_down.length <= event.keyCode){
	keys_down.push(true);
    }
    if(!keys_down[event.keyCode]){
	keys_down[event.keyCode] = true;
	if(curr_user_input_group.keyboard.length > event.keyCode){
	    // If this input group can handle this key value
	    curr_user_input_group.keyboard[event.keyCode].press_callback();
	}
    }
}
function handle_release_user_input (event) {
    while(keys_down.length <= event.keyCode){
	keys_down.push(false);
    }
    if(keys_down[event.keyCode]){
	keys_down[event.keyCode] = false;
	if(curr_user_input_group.keyboard.length > event.keyCode){
	    // If this input group can handle this key value
	    curr_user_input_group.keyboard[event.keyCode].release_callback();
	}
    }
}
if (document.addEventListener) {
    // For all major browsers, except IE 8 and earlier
    document.addEventListener("keydown", handle_press_user_input);
    document.addEventListener("keyup", handle_release_user_input);
} else if (document.attachEvent) {
    // For IE 8 and earlier versions
    document.attachEvent("keydown", handle_press_user_input);
    document.attachEvent("keyup", handle_release_user_input);
}

var disabled_controls = new User_Input_Group();
var pre_disabled_controls = null;
function disable_controls () {
    curr_user_input_group.release();
    pre_disabled_controls = curr_user_input_group;
    disabled_controls.bind();
}
function enable_controls () {
    if(pre_disabled_controls == null){
	console.log("ERROR::attempting to enable controls that werent disabled");
    }
    pre_disabled_controls.bind();
    pre_disabled_controls = null;
}

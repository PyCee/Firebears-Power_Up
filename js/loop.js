// Keeps track of our game time
var global_timeline = new Timeline();
var last_frame_time = window.performance.now();
var current_frame_time = 0;

// Show the title scene on start
Basic.map.set(new Vector(5.0, 16 * canvas_dimensions.aspect_ratio.multiplier - (0.5 + 0.8)));
exploration.scene.show();

function loop () {
    // Main game loop

    // Calculate duration of the last frame
    current_frame_time = window.performance.now();
    var delta_s = (current_frame_time - last_frame_time)/1000;
    last_frame_time = current_frame_time;

    Update_Timelines(delta_s);

    // Update current scene
    curr_scene.update(delta_s);
    
    // Update the cutscene variable
    Active_Sequence_List.update(delta_s);
    
    // Write any dialogue
    Dialogue.write(delta_s);
}

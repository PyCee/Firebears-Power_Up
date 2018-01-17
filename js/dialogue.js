var Dialogue = {
    text_array: [],
    timeline: new Timeline(),
    duration: 0.0,
    font_size: 0.02,
    bg_offset: new Vector(canvas.width * 0.025,
			 canvas.height * 0.8),
    bg_size: new Vector(canvas.width * 0.95,
			canvas.height * 0.15),
    text_offset: new Vector(0.08, 0.465),
    set: function (text_array, duration=-1) {
	Dialogue.text_array = [];
	for(var i = 0; i < text_array.length; ++i){
	    Dialogue.text_array.push(
		new Text(new Vector(Dialogue.text_offset.x,
				    Dialogue.text_offset.y + i * Dialogue.font_size),
			 Dialogue.font_size,
			 text_array[i], "#002211"));
	}
	Dialogue.duration = duration;
	Dialogue.timeline.reset();
    },
    reset: function (){
	Dialogue.set([]);
	Dialogue.timeline.reset();
	Dialogue.duration = -1;
    },
    has_text () {return Dialogue.text_array.length != 0},
    write (delta_s) {
	// TODO: specify dialogue area
	if(Dialogue.has_text()){
	    // If there is text to write
	    
	    // Update the timeline
	    Dialogue.timeline.update(delta_s);
	    if(Dialogue.timeline.get_elapsed_time() >= Dialogue.duration &&
	       Dialogue.duration != -1){
		// If the text has lived it's life
		//   reset the dialogue
		Dialogue.reset();
		return;
	    }

	    // Draw dialogue background
	    ctx.fillStyle = "#ffffff";
	    ctx.fillRect(Dialogue.bg_offset.x, Dialogue.bg_offset.y,
			 Dialogue.bg_size.x, Dialogue.bg_size.y);
	    for(var i = 0; i < Dialogue.text_array.length; ++i){
		// Display all lines of text
		Dialogue.text_array[i].display();
	    }
	}
    }
};

class Animation {
    constructor (name, spritemap, frame_array=[[0,0]],
		 duration=1.0, base_repeats=1) {
		this.name = name;
		this.spritemap = spritemap;
		this.frame_array = frame_array;
		this.duration = duration;
		this.frame_time = this.duration / this.frame_array.length;
		this.base_repeats = base_repeats;
		this.repeats = this.base_repeats;
		this.frame = 0;
		this.timeline = new Timeline();
		this.hidden = false;
		this.horizontal_flip = false;
		// Check frame_array for validity
		for(var i = 0; i < this.frame_array.length; ++i){
		    if(this.frame_array[i].length != 2){
			// If there aren't 2 elements to describe a frame
			console.log("Animation "+this.name+" has an invalid frame_array");
		    } else if(this.frame_array[i][0] < 0 ||
			     this.frame_array[i][0] >= spritemap.cols){
			console.log("Animation " + this.name + " frame " +
				    i + " has invalid col: " + this.frame_array[i][0]);
		    } else if(this.frame_array[i][1] < 0 ||
			     this.frame_array[i][1] >= spritemap.rows){
			console.log("Animation " + this.name + " frame " +
				    i + " has invalid row: " + this.frame_array[i][1]);
		    }
		}
    }
    hide () {this.hidden = true;}
    show () {this.hidden = false;}
    reset () {
		this.timeline.reset();
		this.timeline.start();
		this.frame = 0;
		this.repeats = this.base_repeats;
	}
	toggle_flip () {
		this.set_flip(!this.horizontal_flip);
	}
	set_flip (flip=true) {
		this.horizontal_flip = flip;
	}
    update (delta_s) {
		while(this.timeline.get_elapsed_time() > this.frame_time){
		    this.timeline.set(this.timeline.get_elapsed_time() - this.frame_time);
		    ++this.frame;
		    if(this.frame == this.frame_array.length) {
				if(--this.repeats != 0){
				    this.frame = 0;
				    if(this.repeats == -2){
						this.repeats = -1;
			    	}
				} else {
			    	this.frame = this.frame_array.length - 1;
			    	this.timeline.stop();
				}
	    	}
		}
    }
    is_finished () {
		return this.timeline.active == false;
    }
    draw (position, size) {
		if(this.hidden == false){
	    	// If the animation should be displayed
	    	position = position.scale(scene_scale);
	    	size = size.scale(scene_scale);
	    	//console.log(this.name);
			// Draw the current frame from the sprite sheet
			
			if(this.horizontal_flip){
				ctx.scale(-1, 1);
				position.x = (position.x + size.x) * -1.0;
			}	
	    	ctx.drawImage(this.spritemap.resource,
				  // Spritemap offset (x, y)
				  this.frame_array[this.frame][0] *
				  this.spritemap.get_sprite_width(),
				  this.frame_array[this.frame][1] *
				  this.spritemap.get_sprite_height(),
				  // Spritemap dimensions (width, height)
				  this.spritemap.get_sprite_width(),
				  this.spritemap.get_sprite_height(),
				  // Position (x, y)
				  position.x, position.y,
				  // Display dimensions (width, height)
				  size.x, size.y);
		}
		if(this.horizontal_flip){
			ctx.scale(-1, 1);
		}
    }
}

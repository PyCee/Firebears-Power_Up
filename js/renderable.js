var g_next_renderable_id = 0;
function assign_renderable_id () {
    return g_next_renderable_id++;
}

class Renderable {
    constructor (position, size, animation, draw_priority=1){
	this.position = position;
	this.size = size;
    this.animation = animation;
    this.draw_priority = draw_priority;
    if(draw_priority <= 0){
        console.log("ERROR::Renderable with draw_priority == " + draw_priority);
    }
	this.should_display = true;
    this.id = assign_renderable_id();
    //console.log(this.id);
    }
    hide () {this.should_display = false;}
    show () {this.should_display = true;}
    set_animation (animation) {
	this.animation = animation;
	this.animation.reset();
    }
    set_position (position) {
	this.position = position;
    }
    update_animation (delta_s) {
	this.animation.update(delta_s);
    }
    display () {
	if(this.should_display){
	    this.animation.draw(this.position, this.size);
	}
    }
}

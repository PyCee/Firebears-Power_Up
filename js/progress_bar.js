class Progress_Bar extends Renderable {
    constructor (position, size, animation, back_animation,
		 max, progress, ceiling=true, floor=true) {
	super(position, size, animation);
	this.max = max;
	this.progress = progress;
	this.back_animation = back_animation;
	this.ceiling = ceiling;
	this.floor = floor;
    }
    add_progress (delta_progress) {
	this.progress += delta_progress;
	if(this.progress > this.max){
	    this.progress = this.max;
	} else if (this.progress < 0){
	    this.progress = 0;
	}
    }
    set_progress (progress) {
	this.progress = progress;
    }
    display () {
	this.back_animation.draw(this.position, this.size);
	this.animation.draw(this.position,
			    new Vector(this.size.x * this.progress / this.max,
				       this.size.y));
    }
}

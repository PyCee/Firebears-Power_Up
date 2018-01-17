class Timeline {
    constructor (active=true) {
	// Elapsed time in seconds
	this.elapsed_time = 0.0;
	this.active = active;
	this.timers = [];
    }
    get_elapsed_time () {return this.elapsed_time;}
    start () {this.active = true;}
    stop () {this.active = false;}
    set (time) {this.elapsed_time = time;}
    reset () {
	this.set(0.0);
    }
    update (delta_s) {
	if(this.active){
	    this.elapsed_time += delta_s;
	    for(var i = 0; i < this.timers.length; ++i){
		this.timers[i].test();
	    }
	}
    }
    add_event (time, callback) {
	this.timers.push(new Timer(time, callback, this));
    }
}

var Active_Sequence_List = {
    sequences: [],
    update: function (delta_s) {
		for(var i = 0; i < Active_Sequence_List.sequences.length; ++i){
		    Active_Sequence_List.sequences[i].update(delta_s);
		}
    }
};
class Sequence {
    constructor () {
		this.timeline = new Timeline();
		this.lerps = [];
		this.last_update_time = 0;
    }
    update (delta_s) {
		var curr_update_time = this.timeline.get_elapsed_time();
		for(var i = 0; i < this.lerps.length; ++i){
		    var pre_et = this.last_update_time;
		    var post_et = curr_update_time;
		    if(post_et > this.lerps[i].t1 && pre_et < this.lerps[i].t2){
				// If the current time or the last time is within lerp[i]'s timeframe
				if(pre_et < this.lerps[i].t1){
					pre_et = this.lerps[i].t1;
				}
				if(post_et > this.lerps[i].t2){
					post_et = this.lerps[i].t2;
				}
				this.lerps[i].update(pre_et - post_et);
		    }
		}
		this.last_update_time = curr_update_time;
    }
    add_lerp (lerp) {
		this.lerps.push(lerp);
    }
    add_event (time, callback) {
		this.timeline.add_event(time, callback);
    }
    start () {
		Active_Sequence_List.sequences.push(this);
    }
}
class Lerp {
    constructor (t1, t2, delta_v, renderables) {
		this.t1 = t1;
		this.t2 = t2;
		this.delta_v = delta_v;
		this.renderables = renderables;
    }
    update (change) {
		var scale = change / (this.t2 - this.t1);
		var delta_v = this.delta_v.scale(scale);
		for(var j = 0; j < this.renderables.length; ++j){
		    this.renderables[j].set_position(this.renderables[j].position.add(delta_v));
		}
    }
}

var FORCE_DUE_TO_GRAVITY = 9.8;

class Actor extends Renderable {
    constructor (position, size, animation, draw_priority=1, blocking=true, movable=true,
		 update=function(){}) {
	super(position, size, animation, draw_priority);
	this.bounding_box = new Block(this.position, this.size);
	this.blocking = blocking;
	this.movable = movable;
	this.velocity = new Vector(0.0, 0.0);
	this.update = update;
    }
    update (delta_s) {}
    set_position (position) {
	this.position = position;
	this.bounding_box = new Block(this.position, this.size);
    }
    step_physics (actors) {
	if(!this.movable){
	    return;
	} else {
		this.velocity = this.velocity.add(new Vector(0.0, FORCE_DUE_TO_GRAVITY).scale(PHYSICS_UPDATE_DELTA_S));
		this.position = this.position.add(this.velocity.scale(PHYSICS_UPDATE_DELTA_S));
	}
	if(!this.blocking){
		return;
	}
	for(var i = 0; i < actors.length; ++i){
	    // Do not test for collision with self
	    if(actors[i].id == this.id){
		continue;
	    }
	    // For each block in the list
	    if(!actors[i].blocking){
		continue;
	    }
	    var updated_bb = new Block(this.position, this.size);
	    var inter = actors[i].bounding_box.detect_intersection(updated_bb);
	    if(inter == block_relative_position.intersects){
		// If the actor's bounding box and the block intersect
		// Check the previous relative position and un-intersect the actor
		// Check where the actor was before the recent update
		// and press them against the wall

		var pre_inter =
		    actors[i].bounding_box.detect_intersection(this.bounding_box);
		
		switch(pre_inter){
		case block_relative_position.left:
		    this.position.x = actors[i].bounding_box.position.x - this.size.x;
		    break;
		case block_relative_position.right:
		    this.position.x = actors[i].bounding_box.position.x +
			actors[i].bounding_box.size.x;
		    break;
		case block_relative_position.above:
		    this.position.y = actors[i].bounding_box.position.y - this.size.y;
			this.velocity = new Vector(this.velocity.x, 0.0);
		    break;
		case block_relative_position.below:
		    this.position.y = actors[i].bounding_box.position.y +
			actors[i].bounding_box.size.y;
			this.velocity = new Vector(this.velocity.x, 0.0);
		    break;
		default:
		    break;
		}
		//i = 0;
	    }
	}
	this.bounding_box = new Block(this.position, this.size);
    }
}

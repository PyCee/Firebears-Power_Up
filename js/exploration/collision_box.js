const COLLISION_BOX_STATE = {
    INTERSECTS: -1,
    LEFT: 1,
	RIGHT: 2,
	HORIZONTAL: 4,
    ABOVE: 8,
	BELOW: 16,
	VERTICAL: 32
};
class Collision_Box {
    constructor (size=new Vector(0.0, 0.0), offset=new Vector(0.0, 0.0), block_layers=[]) {
        this.size = size;
        this.offset = offset;
	    // Block Layers are how collisions are organized.
	    // Each actor has a list of block layers.
	    // That actor will test for collision with all
	    //   actors that share any block layer number
	    // Special cases include:
	    //	 A first list-element of -1 = Behaves as if on every block layer
	    //   An empty block layer list = Will not collide with anything
        this.block_layers = block_layers;
	    this.parent_position = new Vector(0.0, 0.0).add(this.offset);
    }
    get_position () {
        return this.parent_position.add(this.offset);
    }
    intersects (box) {
	    return this.detect_positioning(box) == COLLISION_BOX_STATE.INTERSECTS;
    }
    detect_positioning (box) {
		var box_state = -1;
		if(this.get_position().x + this.size.x > box.get_position().x &&
		   this.get_position().x < box.get_position().x + box.size.x &&
		   this.get_position().y + this.size.y > box.get_position().y &&
		   this.get_position().y < box.get_position().y + box.size.y){
		    // If the boxs intersect
		    box_state = COLLISION_BOX_STATE.INTERSECTS;
		} else if(this.get_position().x >= box.get_position().x + box.size.x){
		    // If box is left of this
		    box_state = COLLISION_BOX_STATE.LEFT;
		} else if(this.get_position().x + this.size.x <= box.get_position().x){
		    // If box is right of this
		    box_state = COLLISION_BOX_STATE.RIGHT;
		} else if(this.get_position().y >= box.get_position().y + box.size.y){
		    // If box is above this
		    box_state = COLLISION_BOX_STATE.ABOVE;
		} else if(this.get_position().y + this.size.y <= box.get_position().y){
		    // If box is below this
		    box_state = COLLISION_BOX_STATE.BELOW;
		} else {
		    console.log("intersection detection failed: likely undefined variables");
		}
		return box_state;
    }
    set_parent_position (parent_position) {
        this.parent_position = parent_position;
    }
    set_block_layers (block_layers=[]){
        this.block_layers = block_layers;
    }
    share_block_layer (box) {
		if(this.block_layers.length == 0 ||
			box.block_layers.length == 0){
			return false;
		}
		for(var i = 0; i < this.block_layers.length; ++i){
            // For each block layer in this
            if(this.block_layers[i] == -1){
                // If this exists on all layers
                return true;
            }
		    for(var j = 0; j < box.block_layers.length; ++j){
		    	// For each block layer in the box
                if(box.block_layers[i] == -1){
                    // If box exists on all layers
                    return true;
                }
		        if(this.block_layers[i] == box.block_layers[j]){
                    // If a layer is shared by both boxes
                    return true;
		    	}
		    }    
        }
        return false;
    }
}

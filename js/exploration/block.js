var block_relative_position = {
    intersects: 0,
    left: 1,
    right: 2,
    above: 3,
    below: 4
};
class Block {
    constructor (position, size) {
	this.position = position.copy();
	this.size = size.copy();
    }
    intersects (block) {
	return this.detect_intersection(block) == block_relative_position.intersects;
    }
    detect_intersection (block) {
	var relative_position = -1;
	if(this.position.x + this.size.x > block.position.x &&
	   this.position.x < block.position.x + block.size.x &&
	   this.position.y + this.size.y > block.position.y &&
	   this.position.y < block.position.y + block.size.y){
	    // If the blocks intersect
	    relative_position = block_relative_position.intersects;
	} else if(this.position.x >= block.position.x + block.size.x){
	    // If block is left of this
	    relative_position = block_relative_position.left;
	} else if(this.position.x + this.size.x <= block.position.x){
	    // If block is right of this
	    relative_position = block_relative_position.right;
	} else if(this.position.y >= block.position.y + block.size.y){
	    // If block is above this
	    relative_position = block_relative_position.above;
	} else if(this.position.y + this.size.y <= block.position.y){
	    // If block is below this
	    relative_position = block_relative_position.below;
	} else {
	    console.log("intersection detection failed: likely undefined variables");
	}
	return relative_position;
    }
}

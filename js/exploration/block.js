const RELATIVE_POSITION = {
    INTERSECTS: -1,
    LEFT: 1,
	RIGHT: 2,
	HORIZONTAL: 4,
    ABOVE: 8,
	BELOW: 16,
	VERTICAL: 32
};
class Block {
    constructor (position, size) {
	this.position = position;
	this.size = size;
    }
    intersects (block) {
	return this.detect_intersection(block) == RELATIVE_POSITION.INTERSECTS;
    }
    detect_intersection (block) {
		var relative_position = -1;
		if(this.position.x + this.size.x > block.position.x &&
		   this.position.x < block.position.x + block.size.x &&
		   this.position.y + this.size.y > block.position.y &&
		   this.position.y < block.position.y + block.size.y){
		    // If the blocks intersect
		    relative_position = RELATIVE_POSITION.INTERSECTS;
		} else if(this.position.x >= block.position.x + block.size.x){
		    // If block is left of this
		    relative_position = RELATIVE_POSITION.LEFT;
		} else if(this.position.x + this.size.x <= block.position.x){
		    // If block is right of this
		    relative_position = RELATIVE_POSITION.RIGHT;
		} else if(this.position.y >= block.position.y + block.size.y){
		    // If block is above this
		    relative_position = RELATIVE_POSITION.ABOVE;
		} else if(this.position.y + this.size.y <= block.position.y){
		    // If block is below this
		    relative_position = RELATIVE_POSITION.BELOW;
		} else {
		    console.log("intersection detection failed: likely undefined variables");
		}
		return relative_position;
    }
}

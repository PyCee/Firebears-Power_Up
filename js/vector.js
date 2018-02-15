class Vector {
    constructor (x, y) {
	this.x = x;
	this.y = y;
    }
    add (vector) {
	return new Vector(this.x + vector.x, this.y + vector.y);
    }
    subtract (vector) {
	return new Vector(this.x - vector.x, this.y - vector.y);
    }
    scale (scalar) {
	return new Vector(this.x * scalar, this.y * scalar);
    }
    normalize () {
        var sum = vector.x * vector.x + vector.y * vector.y;
        if(sum == 0.0){
            return this;
        } else {
            return this.scale(Math.sqrt(sum));
        }
    }
}

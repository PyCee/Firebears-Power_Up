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
	return this.scale(Math.sqrt(vector.x * vector.x + vector.y * vector.y));
    }
}

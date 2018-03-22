class Vector {
    constructor (x, y) {
	    this.x = x;
	    this.y = y;
    }
    clone () {
        return new Vector(this.x, this.y);
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
    dot (vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    normalize () {
        var magnitude = this.dot(this);
        if(magnitude == 0.0){
            return this;
        } else {
            return this.scale(Math.sqrt(magnitude));
        }
    }
    str () {
        return "(" + this.x + ", " + this.y + ")";
    }
}

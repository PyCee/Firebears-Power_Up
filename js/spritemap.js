class Spritemap {
    constructor (resource_s, rows=1, cols=1) {
	    this.resource = load_resource("img", resource_s);
	    this.resource_s = resource_s;
	    this.rows = rows;
	    this.cols = cols;
    }
    get () {
	    return get_resource[this.resource_s];
    }
    get_sprite_width() {
	    return this.resource.width / this.cols;
    }
    get_sprite_height() {
	    return this.resource.height / this.rows;
    }
}
var Sprite = {
    transparent: new Spritemap("transparent.png"),
    black: new Spritemap("black.png"),
    red: new Spritemap("red.png"),
    green: new Spritemap("green.png"),
    blue: new Spritemap("blue.png"),
    power_cube: new Spritemap("power_cube.png"),
    arena_background: new Spritemap("arena_bg.png"),
    blue_goal: new Spritemap("blue_scale.png"),
    red_goal: new Spritemap("red_scale.png")
    //: new Spritemap(".png")
};

class Spritemap {
    constructor (resource_s, cols=1, rows=1) {
	    this.resource = load_resource("img", resource_s);
	    this.resource_s = resource_s;
	    this.cols = cols;
	    this.rows = rows;
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
    red_goal: new Spritemap("red_scale.png"),
    portal: new Spritemap("portal.png"),
    upchuck: new Spritemap("upchuck.png", 2, 1)
    //: new Spritemap(".png")
};

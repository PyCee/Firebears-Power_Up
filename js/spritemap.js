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
    blue_goal: new Spritemap("blue_goal.png"),
    red_goal: new Spritemap("red_goal.png"),
    arrow: new Spritemap("arrow.png"),
    portal: new Spritemap("portal.png"),
    spinny: new Spritemap("spinny.png", 2, 1),
    upchuck: new Spritemap("upchuck.png", 2, 1),
    arcade_move: new Spritemap("arcade_move.png"),
    arcade_pickup: new Spritemap("arcade_pickup.png"),
    arcade_place: new Spritemap("arcade_place.png"),
    arcade_launch: new Spritemap("arcade_launch.png"),
    arcade_pickup_example: new Spritemap("arcade_pickup_example.png"),
    arcade_place_example: new Spritemap("arcade_place_example.png"),
    arcade_launch_example: new Spritemap("arcade_launch_example.png")
    //: new Spritemap(".png")
};

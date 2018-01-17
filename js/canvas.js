var canvas = document.getElementById("drawing_canvas");
var ctx = canvas.getContext("2d");

canvas.style.position = "absolute";

var canvas_dimensions = {
    width: 0,
    height: 0,
    aspect_ratio: {
	x: 16,
	y: 9,
	multiplier: 9.0 / 16.0
    },
    margin_mult: 0.03,
    get_scale: function () {
	// detect desired scale from screen size
	var x_size = window.innerWidth / this.aspect_ratio.x;
	var y_size = window.innerHeight / this.aspect_ratio.y;
	var size = x_size < y_size ? x_size : y_size;
	return size * (1 - this.margin_mult);
    }
};

// canvas pixel resolution
canvas.width = 1080; // X resolution
canvas.height = canvas.width *
    canvas_dimensions.aspect_ratio.multiplier;

function resize_canvas () {
    // canvas style.width and style.height are the screen displayed width and height
    canvas_dimensions.width = canvas_dimensions.aspect_ratio.x *
	canvas_dimensions.get_scale();
    canvas_dimensions.height = canvas_dimensions.aspect_ratio.y *
	canvas_dimensions.get_scale();
    canvas.style.width = canvas_dimensions.width + "px";
    canvas.style.height = canvas_dimensions.height + "px";

    // Centers the canvas horizontally
    var center_margin = (window.innerWidth - canvas_dimensions.width) / 2 + "px";
    canvas.style.marginLeft = center_margin;
    canvas.style.marginRight = center_margin;

    ctx.imageSmoothingEnabled = false;
}

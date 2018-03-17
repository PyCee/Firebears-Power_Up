class Text extends Renderable {
    constructor (position, font_height, text, color) {
		super(position, new Vector(0.0, 0.0), null, 99);
		this.font_height = font_height;
		this.text = text;
		this.color = color;
    }
    hide(){}
    show(){}
    set_animation(){}
    update_animation(){}
    display () {
		ctx.textBaseline = "hanging";
		
		ctx.fillStyle = this.color;
		// ctx.font = this.font_height*canvas.width + "px Lucida Console, Monaco, monospace";
		ctx.font = (this.font_height * canvas.width) / curr_scene.inside_width +
			"px Lucida Console, Monaco, monospace";
		var pos = this.position.scale(canvas.width / curr_scene.inside_width);
		ctx.fillText(this.text, pos.x, pos.y);
    }
}

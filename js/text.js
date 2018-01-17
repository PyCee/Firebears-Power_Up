class Text extends Renderable {
    constructor (position, font_size, text, color) {
	super(position, new Vector(font_size, font_size), null);
	this.text = text;
	this.color = color;
    }
    hide(){}
    show(){}
    set_animation(){}
    update_animation(){}
    display () {
	ctx.textBaseline = "top";
	ctx.fillStyle = this.color;
	ctx.font = this.size.y*canvas.width + "px Lucida Console, Monaco, monospace";
	var pos = this.position.scale(canvas.width);
	ctx.fillText(this.text, pos.x, pos.y);
	//ctx.fillText(this.text, this.position.x, this.position.y);
    }
}

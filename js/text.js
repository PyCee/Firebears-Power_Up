class Text extends Renderable {
    constructor (position, font_height, text, color) {
        super(position, new Vector(0.0, 0.0), null, 99);
        this.font_height = font_height;
        this.text = text;
        this.color = color;
    }
    set_text (text){
        this.text = text;
    }
    hide(){}
    show(){}
    set_animation(){}
    update_animation(){}
    display () {}
}
class Screen_Text extends Text {
    /*
        position - vector with screen coordinates (0, 1)
    */
    display () {
        ctx.textBaseline = "hanging";
        ctx.fillStyle = this.color;
        ctx.font = (this.font_height * canvas.height) +
            "px Lucida Console, Monaco, monospace";
        var pos = new Vector(this.position.x * canvas.width / Viewport.get_scale().x,
            this.position.y * canvas.height / Viewport.get_scale().y);
        pos = new Vector(pos.x - Viewport.offset.x, pos.y + Viewport.offset.y);
        ctx.fillText(this.text, pos.x, pos.y);
    }
}
class World_Text extends Text {
    /*
        position - vector with world coordinates (0, curr_scene.inside_width)
    */
    display () {
        ctx.textBaseline = "hanging";
        ctx.fillStyle = this.color;
        ctx.font = (this.font_height * canvas.width) / curr_scene.inside_dimensions.x +
            "px Lucida Console, Monaco, monospace";
            // todo: have x dimension affect x and y dimension affect y
        var pos = this.position.scale(canvas.width / curr_scene.inside_dimensions.x);
        ctx.fillText(this.text, pos.x, pos.y);
    }
}

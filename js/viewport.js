var Viewport = {
    offset: new Vector(0.0, 0.0),
    size: new Vector(0.0, 0.0),
    update_function: null,
    set_update: function (update_function=null) {
        Viewport.update_function = update_function;
    },
    get_scale: function () {
        return new Vector(curr_scene.inside_dimensions.x / Viewport.size.x,
            curr_scene.inside_dimensions.y / Viewport.size.y);
    }
};
function Update_Viewport () {
    if(Viewport.update_function != null){
        Viewport.update_function();
    } else {
        console.log("No Viewport.update_function set");
    }

    // var scale = new Vector(curr_scene.inside_dimensions.x / Viewport.size.x,
    //     curr_scene.inside_dimensions.y / Viewport.size.y);
    var scale = Viewport.get_scale();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(Viewport.offset.x * scale.x, -1.0 * Viewport.offset.y * scale.y);
    ctx.scale(scale.x, scale.y);
}

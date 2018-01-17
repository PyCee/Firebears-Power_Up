var curr_scene = null;
var scene_scale = 1.0;
class Scene {
    constructor (name="DEFAULT", inside_width=1.0, show_callback=function(){},
		 inner_update_callback=function(delta_s){}) {
	this.name = name;
	this.inside_width = inside_width;
	this.show_callback = show_callback;
	this.inner_update_callback = inner_update_callback;
	
	this.renderables_list = [];
	this.user_input = new User_Input_Group();
    }
    update (delta_s) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.inner_update_callback(delta_s);

	// Update animations and display
	for(var i = 0; i < this.renderables_list.length; ++i){
	    this.renderables_list[i].update_animation(delta_s);
	}
	this.display();
    }
    display () {
	// TODO: set scene_scale to canvas.scale (whatever it is)
	//   and remove all refs to scene_scale
	var scale = canvas.width / this.inside_width;
	scene_scale = scale;
	//scene_scale = 1.0;
	// Draw scene's renderables
	for(var i = 0; i < this.renderables_list.length; ++i){
		this.renderables_list[i].display();
	}
    }
    show () {
	if(curr_scene != null){
	    // If there is a previous scene, release it's user input
	    curr_scene.user_input.release();
	}
	curr_scene = this;
	this.user_input.bind();
	this.show_callback();
    }
    set_renderables (renderables_list) {
		this.renderables_list = renderables_list;

		// Sort renerables_list so painters algorithm will draw according to priority
		this.renderables_list.sort(function(ren_1, ren_2){
			return ren_1.draw_priority - ren_2.draw_priority;
		});
    }
    add_renderable (renderable) {
		var tmp_renderables = this.renderables_list;
		tmp_renderables.push(renderable);
		this.set_renderables(tmp_renderables);
		return this.renderables_list[this.renderables_list.length - 1].id;
    }
    remove_renderable (renderable) {
	var index = this.renderables_list.indexOf(renderable);
	if(index == -1){
	    console.log("Scene.remove_renderable called with invalid renderable: " +
			renderable);
	} else {
	    this.remove_renderable_index(index);
	}
    }
    remove_renderable_id (id) {
	for(var i = 0; i < this.renderables_list.length; ++i){
	    if(id == this.renderables_list[i].id){
		this.remove_renderable_index(i);
		return;
	    }
	}
    }
    remove_renderable_index (index) {
		var tmp_renderables = this.renderables_list;
		tmp_renderables.splice(index, 1);
		this.set_renderables(tmp_renderables);
    }
}

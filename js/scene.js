var curr_scene = null;
var scene_scale = 1.0;
class Scene {
    constructor (name="DEFAULT", inside_width=1.0, show_callback=function(){},
		background_actor=null, inner_update_callback=function(delta_s){}) {
	this.name = name;
	this.inside_width = inside_width;
	this.show_callback = show_callback;
	this.inner_update_callback = inner_update_callback;
	this.background_actor = background_actor;
	
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
    }
    display () {
	// TODO: set scene_scale to canvas.scale (whatever it is)
	//   and remove all refs to scene_scale
	var scale = canvas.width / this.inside_width;
	scene_scale = scale;
	//scene_scale = 1.0;
	// Draw scene's renderables
	if(this.background_actor != null){
		this.background_actor.display(this.background_actor.display_position, this.background_actor.size);
	}
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
	sort_renderables () {
		// Sort renerables_list so painters algorithm will draw according to priority
		this.renderables_list.sort(function(ren_1, ren_2){
			return ren_1.draw_priority - ren_2.draw_priority;
		});
	}
    set_renderables (renderables_list) {
		// Use .slice() to clone the array
		this.renderables_list = renderables_list.slice();
		// this.renderables_list = renderables_list;
		// var tmp_renderables = [];
		// for(var i = 0; i < renderables_list.length; ++i){
		// 	tmp_renderables[i] = renderables_list[i];
		// }
		// this.renderables_list = tmp_renderables;
		this.sort_renderables();
	}
	get_renderable_from_id(id){
		for(var i = 0; i < this.renderables_list.length; ++i){
			if(this.renderables_list[i].id == id){
				return this.renderables_list[i];
			}
		}
		return null;
	}
    add_renderable (renderable) {
		this.renderables_list.push(renderable);
		this.sort_renderables();
		// this.set_renderables(this.renderables_list);
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

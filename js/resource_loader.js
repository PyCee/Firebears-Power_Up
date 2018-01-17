var resources = [];
var resource_path = "res/"
var resource_loaded = [];

function load_resource (type, res_string) {
    if(!resources[res_string]){
	switch(type){
	case "img":
	    resources[res_string] = new Image();
	    break;
	default:
	    console.log("error::Attempted to load resource of unknown type: " + type);
	    break;
	}
	resource_loaded[res_string] = false;
	resources[res_string].onload = function () {
	    resource_loaded[res_string] = true;
	};
	resources[res_string].src = resource_path + res_string;
    }
    return resources[res_string];
}
function is_resource_loaded (res_string) {
    return resource_loaded[res_string];
}
function get_resource (res_string) {
    if(!resources[res_string]){
	console.log("error::Attempted to get unknown resource: " + res_string);
    }
    if(!is_resource_loaded(res_string)){
	console.log("attempting to get unloaded resource " + res_string);
    }
    return resources[res_string];
}

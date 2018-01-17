var Selection_Type = {
    Next: 0,
    Previous: 1
};
class Selection {
    constructor (selections, loop = false) {
	if(selections.length < 1){
	    console.log("Attempting to make selection of length < 1");
	}
	this.loop = loop;
	this.options = selections;
	this.selected_i = 0;
    }
    set_index (i) {
	this.selected_i = i;
    }
    reset () {
	this.set_index(0);
    }
    select (option) {
	var option_index = this.options.indexOf(option);
	if(option_index == -1){
	    console.log("Attempting to select non existing option: " + option);
	} else {
	    this.set_index(option_index);
	}
    }
    change (selection_type) {
	switch(selection_type){
	case Selection_Type.Next:
	    return this.next();
	    break;
	case Selection_Type.Previous:
	    return this.previous();
	    break;
	default:
	    break;
	}
    }
    next () {
	++this.selected_i;
	if(this.selected_i > this.options.length-1){
	    if(this.loop){
		this.selected_i -= this.options.length;
	    } else{
		this.selected_i = this.options.length-1;
	    }
	}
	return this.get();
    }
    previous () {
	--this.selected_i;
	if(this.selected_i < 0){
	    if(this.loop){
		this.selected_i += this.options.length;
	    } else{
		this.selected_i = 0;
	    }
	}
	return this.get();
    }
    get_start () {
	return this.options[0];
    }
    get_end () {
	return this.options[this.options.length-1];
    }
    get () {
	return this.options[this.selected_i];
    }
    get_index () {
	return this.selected_i;
    }
}

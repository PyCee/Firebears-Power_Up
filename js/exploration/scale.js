const SCALE_SCORING_BOX_SIZE = new Vector(1.3, 3.0);

class Scale extends Goal {
    constructor (position, draw_priority) {
        super(position, new Vector(1.3, 0.3), new Animation("Scale", Sprite.blue),
            draw_priority, [1]);
        this.scoring_box = new Block(position.subtract(new Vector(0.0, SCALE_SCORING_BOX_SIZE.y)),
            SCALE_SCORING_BOX_SIZE);

        var this_id = this.id;  
        this.update = function () {
            var this_ = exploration.scene.get_renderable_from_id(this_id);
            this_.update_cube_count();
        };
    }
    update_cube_count () {
        this.cube_count = 0;
        for(var i = 0; i < power_cube_id_list.length; ++i){
            // For each power cube
            var cube = exploration.scene.get_renderable_from_id(power_cube_id_list[i]);
            if(cube && this.scoring_box.intersects(cube.bounding_box)){
                this.cube_count++;
            }
        }
    }
}
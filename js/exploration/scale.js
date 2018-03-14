const SCALE_SCORING_BOX_SIZE = new Vector(1.5, 5.0);

class Scale_Component extends Goal {
    constructor (position, draw_priority, allience) {
        super(position, draw_priority, allience, 
            [
                new Collision_Box(new Vector(1.5, 0.1),
                    new Vector(0.0, 0.35), [-1]),
                new Collision_Box(new Vector(0.01, 0.35),
                    new Vector(0.0, 0.0), [-1]),
                new Collision_Box(new Vector(0.01, 0.35),
                    new Vector(1.4, 0.0), [-1])
            ]);

        this.scoring_box = new Collision_Box(SCALE_SCORING_BOX_SIZE,
            new Vector(0.0, 0.5 - SCALE_SCORING_BOX_SIZE.y), [],
            this.position);
    }
    update_position () {
        this.scoring_box.set_parent_position(this.position);
    }
    get_cube_count () {
        var cube_count = 0;
        for(var i = 0; i < power_cube_id_list.length; ++i){
            // For each power cube
            var cube = exploration.scene.get_renderable_from_id(power_cube_id_list[i]);
            if(!cube){
                continue;
            }
            for(var j = 0; j < cube.physics_state.collision_boxes.length; ++j){
                if(this.scoring_box.intersects(cube.physics_state.collision_boxes[j])){
                    cube_count++;
                }
            }
        }
        return cube_count;
    }
}
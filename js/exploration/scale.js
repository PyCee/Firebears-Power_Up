const SCALE_SCORING_BOX_SIZE = new Vector(1.3, 3.0);

class Scale_Component extends Goal {
    constructor (position, draw_priority, sprite) {
        super(position, new Vector(1.3, 0.3), new Animation("Scale", sprite),
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
const SECOND_SCALE_OFFSET = new Vector(1.4, 0.0);
class Scale {
    constructor (position, draw_priority) {
        this.ally_side = new Scale_Component(position, draw_priority, Sprite.blue);
        this.opp_side = new Scale_Component(position, draw_priority, Sprite.red);
        var own_left = Math.floor(Math.random() * 2);
        if(own_left){
            this.opp_side.set_absolute_position(this.opp_side.display_position.add(SECOND_SCALE_OFFSET));
        } else {
            this.ally_side.set_absolute_position(this.opp_side.display_position.add(SECOND_SCALE_OFFSET));
        }
    }
}
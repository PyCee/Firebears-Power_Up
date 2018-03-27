var aquisition_id_list = [];
class Aquisition extends Actor {
    constructor (position, size, animation, draw_priority, collision_boxes) {
        super(position, size, animation, draw_priority,
            function(delta_s){}, -1, collision_boxes);
        aquisition_id_list.push(this.id);
    }
    get_cube () {
        Add_Debug_String("Should never see a base Aquisition.get_cube()");
        return null;
    }
}

// Cube Stack
class Cube_Stack extends Aquisition {
    constructor (position, draw_priority) {
        super(position, new Vector(1.05, 0.96),
            new Animation("Cube Stack Animation", Sprite.transparent),
            draw_priority, [
                new Collision_Box(new Vector(1.05, 0.96),
                    new Vector(0.0, 0.0), [])
            ]);
            this.cube_list = [
                new Power_Cube(this.position.add(new Vector(0.0, 0.64))),
                new Power_Cube(this.position.add(new Vector(0.35, 0.64))),
                new Power_Cube(this.position.add(new Vector(0.70, 0.64))),
                new Power_Cube(this.position.add(new Vector(0.175, 0.32))),
                new Power_Cube(this.position.add(new Vector(0.525, 0.32))),
                new Power_Cube(this.position.add(new Vector(0.35, 0.0)))
            ];
            for(var i = 0; i < this.cube_list.length; ++i){
                this.cube_list[i].set_freeze();
                this.cube_list[i].set_ghost();
            }
    }
    get_cube () {
        if(this.cube_list.length > 0){
            return this.cube_list.splice(this.cube_list.length - 1, 1)[0];
        } else {
            return null;
        }
    }
    add_cubes_to_scene () {
        for(var i = 0; i < this.cube_list.length; ++i){
            exploration.scene.add_renderable(this.cube_list[i]);
        }
    }
}

// Portal
const PORTAL_START_CUBE_POS = new Vector(0.3375, 0.62);
class Portal extends Aquisition {
    constructor (position, draw_priority) {
        super(position, new Vector(1.05, 1.2),
            new Animation("Portal Animation", Sprite.portal),
            draw_priority, [
                new Collision_Box(new Vector(1.05, 1.2),
                    new Vector(0.0, 0.0), [])
            ]);
        this.load_cube_timeline = new Timeline();
        this.cube = new Power_Cube(this.position.add(PORTAL_START_CUBE_POS));
        this.cube.set_ghost();
        this.cube.draw_priority = 1;
        exploration.scene.add_renderable(this.cube);

        this.rise_sequence = new Sequence();
        this.rise_sequence.add_lerp(new Lerp(0.0, 4.0, new Vector(0.0, 0.4),
            [this.cube]));
        this.rise_sequence.start();
    }
    get_cube () {
        if(this.load_cube_timeline.get_elapsed_time() > 4.0){
            this.start_cube_rise();
            return new Power_Cube(new Vector(0.0, 0.0));
        }
    }
    start_cube_rise () {
        this.cube.set_absolute_position(this.position.add(PORTAL_START_CUBE_POS));
        this.rise_sequence.reset();
        this.load_cube_timeline.reset();
    }
}
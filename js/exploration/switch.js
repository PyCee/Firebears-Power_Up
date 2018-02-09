
class Switch extends Actor {
    constructor (position, draw_priority) {
        super(position, new Vector(1.5, 0.5), new Animation(Sprite.red, "switch"), 1, false, -1.0);

        this.update = function () {
            for(var i = 0; i < power_cube_id_list.length; ++i){
                // For each power cube
                var cube = exploration.scene.get_renderable_from_id(power_cube_id_list[i]);
                if(this.bounding_box.intersects(cube.bounding_box)){
                    console.log("got cube");
                    //TODO: do stuff to cube
                }
            }
        };
    }
}
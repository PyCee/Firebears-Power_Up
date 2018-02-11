var power_cube_id_list = [];

class Power_Cube extends Actor {
    constructor (position) {
        super(position, new Vector(0.4, 0.4), new Animation(Sprite.green, "Power Cube Idle"),
            1, [-1]);
        power_cube_id_list.push(this.id);
    }
}
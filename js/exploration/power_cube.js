var power_cube_id_list = [];

class Power_Cube extends Actor {
    constructor (position) {
        super(position, new Vector(0.35, 0.32), new Animation("Power Cube Idle", Sprite.power_cube),
            1, [-1]);
        power_cube_id_list.push(this.id);
    }
}
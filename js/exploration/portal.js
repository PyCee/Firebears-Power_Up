class Portal extends Actor {
    constructor (position, draw_priority) {
        super(position, new Vector(1.0, 1.5), new Animation("Portal", Sprite.blue),
            draw_priority, [-1], -1);
    }
}
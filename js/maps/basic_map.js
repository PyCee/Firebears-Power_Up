var Basic = {
    map: new Map(7),
    width: 7,
    height: 7 * canvas_dimensions.aspect_ratio.multiplier,
    ground: new Actor(new Vector(0.0, 7 * 
                        canvas_dimensions.aspect_ratio.multiplier - 0.5),
                        new Vector(7, 0.5),
                new Animation(Sprite.black, "Still Ground", [[0,0]], 1, -1),
                1, true, -1)
};

Basic.map.set_actors([Basic.ground, robot]);
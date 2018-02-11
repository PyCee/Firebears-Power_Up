var Basic = {
    map: new Map(16),
    width: 16,
    height: 16 * canvas_dimensions.aspect_ratio.multiplier,
    ground: new Actor(new Vector(0.0, 16 * 
                        canvas_dimensions.aspect_ratio.multiplier - 0.5),
                        new Vector(16, 0.5),
                new Animation(Sprite.black, "Still Ground", [[0,0]], 1, -1),
                1, [-1], -1),
    switch: new Switch(new Vector(3.0, 16 * canvas_dimensions.aspect_ratio.multiplier - (0.5 + 0.5)), 2),
    scale: new Scale(new Vector(6.0, 16 * canvas_dimensions.aspect_ratio.multiplier - (0.5 + 2.5)), 2)
};

Basic.map.set_actors([Basic.ground, robot, Basic.switch, Basic.scale]);
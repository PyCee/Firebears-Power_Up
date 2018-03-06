const DISTANCE_BEHIND_DRIVER_WALLS = 2.0;
const FIELD_WIDTH = 16.0;
const RIGHT_WALL = FIELD_WIDTH + DISTANCE_BEHIND_DRIVER_WALLS;
const ARENA_WIDTH = FIELD_WIDTH + DISTANCE_BEHIND_DRIVER_WALLS * 2;
const ARENA_HEIGHT = ARENA_WIDTH * canvas_dimensions.aspect_ratio.multiplier;

function arena_viewport_update () {
    Viewport.size.x = ARENA_WIDTH * 0.5;
    Viewport.size.y = ARENA_HEIGHT * 0.5;

    var horizontal_center = robot.position.x;
    horizontal_center = Math.min(horizontal_center, ARENA_WIDTH - 5.0);
    horizontal_center = Math.max(horizontal_center, 5.0);
    var offset = new Vector(Viewport.size.x / 2.0 - horizontal_center,
        0.0);

    Viewport.offset.x = offset.x;
    Viewport.offset.y = offset.y + (ARENA_HEIGHT * 0.5);
    Viewport.offset = Viewport.offset.scale(canvas.width / curr_scene.inside_width);
}

var Arena = {
    map: new Map(ARENA_WIDTH, new Actor(new Vector(0.0, 0.0), new Vector(ARENA_WIDTH, ARENA_HEIGHT),
        new Animation("Arena Background", Sprite.arena_background)), function(){
        Spinny.robot.set_absolute_position(new Vector(14.0 + DISTANCE_BEHIND_DRIVER_WALLS,
            ARENA_HEIGHT - (0.5 + 0.3 + 1.0)));
        Spinny.timer.reset();
        Spinny.timer.start();
        Viewport.set_update(arena_viewport_update);

        // TODO: add timer callbacks to update score, every second
    }),
    ground: new Actor(new Vector(0.0, ARENA_HEIGHT - 0.5),
        new Vector(ARENA_WIDTH, 0.5), new Animation("Still Ground", Sprite.black),
        1, function(){}, -1,
        [
            new Collision_Box(new Vector(ARENA_WIDTH, 0.5),
                new Vector(0.0, 0.0), [-1])
        ]),
    r_driver_wall: new Actor(new Vector(DISTANCE_BEHIND_DRIVER_WALLS, ARENA_HEIGHT - (0.5 + 2.5)),
        new Vector(0.4, ARENA_HEIGHT - (ARENA_HEIGHT - (0.5 + 2.5))),
        new Animation("r_driver_wall", Sprite.black), 1, function(){}, -1,
        [
            new Collision_Box(new Vector(0.4, ARENA_HEIGHT - (ARENA_HEIGHT - (0.5 + 2.5))), 
                new Vector(0.0, 0.0), [-1])
        ]),
    l_driver_wall: new Actor(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + 16.0 - 0.4, ARENA_HEIGHT - (0.5 + 2.5)),
        new Vector(0.4, ARENA_HEIGHT - (ARENA_HEIGHT - (0.5 + 2.5))),
        new Animation("l_driver_wall", Sprite.black), 1, function(){}, -1,
        [
            new Collision_Box(new Vector(0.4, ARENA_HEIGHT - (ARENA_HEIGHT - (0.5 + 2.5))), 
                new Vector(0.0, 0.0), [-1])
        ]),
    l_switch: new Switch(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + 3.2, ARENA_HEIGHT - (0.5 + 0.5)), 2),
    r_switch: new Switch(new Vector(RIGHT_WALL - (6.3), ARENA_HEIGHT - (0.5 + 0.5)), 2),
    scale: new Scale(new Vector(ARENA_WIDTH/2 - 1.35, ARENA_HEIGHT - (0.5 + 2.5)), 8),
    cube_stack: new Cube_Stack(new Vector(0.4 + DISTANCE_BEHIND_DRIVER_WALLS, ARENA_HEIGHT - (0.5 + 0.66)), 1),
};

Arena.map.set_actors([
    Arena.ground,
    Arena.r_driver_wall,
    Arena.l_driver_wall,
    robot,
    Spinny.robot,
    Arena.l_switch.ally_side,
    Arena.l_switch.opp_side,
    Arena.r_switch.ally_side,
    Arena.r_switch.opp_side,
    Arena.scale.ally_side,
    Arena.scale.opp_side,
    Arena.cube_stack
    ]);
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
    scoring: {
        blue: 0,
        red: 0
    },
    map: new Map(ARENA_WIDTH, new Actor(new Vector(0.0, 0.0), new Vector(ARENA_WIDTH, ARENA_HEIGHT),
        new Animation("Arena Background", Sprite.arena_background)), function(){
        Spinny.robot.set_absolute_position(new Vector(14.0 + DISTANCE_BEHIND_DRIVER_WALLS,
            ARENA_HEIGHT - (0.5 + 0.3 + 1.0)));
        Spinny.timer.reset();
        Spinny.timer.start();
        Viewport.set_update(arena_viewport_update);

        Arena.score_timeline.start();

        Arena.scoring.blue = 0;
        Arena.scoring.red = 0;
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
    scale: new Goal_Pair(new Vector(ARENA_WIDTH/2 - 1.55, ARENA_HEIGHT - (0.5 + 2.5)),
        8, GOAL_COMPONENT.TYPE.SCALE),
    l_switch: new Goal_Pair(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + 3.2, ARENA_HEIGHT - (0.5 + 0.5)),
        1, GOAL_COMPONENT.TYPE.SWITCH),
    r_switch: new Goal_Pair(new Vector(RIGHT_WALL - (6.3), ARENA_HEIGHT - (0.5 + 0.5)),
        1, GOAL_COMPONENT.TYPE.SWITCH),
    l_cube_stack: new Cube_Stack(new Vector(0.4 + DISTANCE_BEHIND_DRIVER_WALLS, ARENA_HEIGHT - (0.5 + 0.66)), 1),
    r_cube_stack: new Cube_Stack(new Vector(RIGHT_WALL - 1.4, ARENA_HEIGHT - (0.5 + 0.66)), 1),
    score_timeline: new Timeline(false)
};

function update_score_with_ownership (goal_pair) {
    var text_rise_duration = 3.0;
    var score_ind = null;
    switch(goal_pair.get_ownership()){
    case ALLIENCE_TYPE.BLUE:
        Arena.scoring.blue = Arena.scoring.blue + 1;
        score_ind = new Text(goal_pair.blue_component.position.add(new Vector(0.4, -0.6)),
            0.5, "+1", "#0000ff");
        break;
    case ALLIENCE_TYPE.RED:
        Arena.scoring.red = Arena.scoring.red + 1;
        score_ind = new Text(goal_pair.red_component.position.add(new Vector(0.4, -0.6)),
            0.5, "+1", "#ff0000");
        break;
    default:
        break;
    }
    if(score_ind != null){
        var id = score_ind.id;
        exploration.scene.add_renderable(score_ind);
        var point_float_sequence = new Sequence();
        point_float_sequence.add_lerp(new Lerp(0.0, text_rise_duration, new Vector(0.0, 2.2),
                                 [score_ind]));
        point_float_sequence.add_event(text_rise_duration, function(){
            exploration.scene.remove_renderable_id(id);
        });
        point_float_sequence.start();
    }
}
Arena.score_timeline.add_event(1.0, function(){
    Arena.score_timeline.reset();
    update_score_with_ownership(Arena.l_switch);
    update_score_with_ownership(Arena.r_switch);
    update_score_with_ownership(Arena.scale);
    console.log(Arena.scoring.blue + " : " + Arena.scoring.red);
});

Arena.map.set_actors([
    Arena.ground,
    Arena.r_driver_wall,
    Arena.l_driver_wall,
    robot,
    Spinny.robot,
    Arena.scale.blue_component,
    Arena.scale.red_component,
    Arena.l_switch.blue_component,
    Arena.l_switch.red_component,
    Arena.r_switch.blue_component,
    Arena.r_switch.red_component,
    Arena.l_cube_stack,
    Arena.r_cube_stack
    ]);
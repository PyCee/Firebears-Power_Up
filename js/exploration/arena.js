const DISTANCE_BEHIND_DRIVER_WALLS = 2.0;
const FIELD_WIDTH = 16.0;
const RIGHT_WALL = FIELD_WIDTH + DISTANCE_BEHIND_DRIVER_WALLS;
const ARENA_WIDTH = FIELD_WIDTH + DISTANCE_BEHIND_DRIVER_WALLS * 2;
const ARENA_HEIGHT = ARENA_WIDTH * canvas_dimensions.aspect_ratio.multiplier;

function arena_viewport_update () {
    Viewport.size.x = ARENA_WIDTH * 0.5;
    Viewport.size.y = ARENA_HEIGHT * 0.5;

    var horizontal_center = robot.position.x + robot.size.x/2;
    horizontal_center = Math.min(horizontal_center, ARENA_WIDTH - 5.0);
    horizontal_center = Math.max(horizontal_center, 5.0);
    var offset = new Vector(Viewport.size.x / 2.0 - horizontal_center,
        0.0);

    Viewport.offset.x = offset.x;
    Viewport.offset.y = offset.y + (ARENA_HEIGHT * 0.5);
    Viewport.offset = Viewport.offset.scale(canvas.width / curr_scene.inside_dimensions.x);
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

        exploration.scene.add_renderable(team_number);
       exploration.scene.add_renderable(Arena.blue_score);
        exploration.scene.add_renderable(Arena.red_score);
        exploration.scene.add_renderable(Arena.countdown_text);
        exploration.scene.add_renderable(Arena.l_portal.cube);
        exploration.scene.add_renderable(Arena.r_portal.cube);
        Arena.l_cube_stack.add_cubes_to_scene();
        Arena.r_cube_stack.add_cubes_to_scene();

        Arena.scoring.blue = 0;
        Arena.scoring.red = 0;
    }),
    blue_score: new Screen_Text(new Vector(0.05, 0.1), 2.0, "0", "#0000ff"),
    red_score: new Screen_Text(new Vector(0.75, 0.1), 2.0, "0", "#ff0000"),
    countdown: 60,
    countdown_text: new Screen_Text(new Vector(0.4, 0.1), 2.5, "60", "#000000"),
    win_text: new Screen_Text(new Vector(0.15, 0.5), 2.0, "Noone Wins!", "#000000"),
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
    l_driver_wall: new Actor(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + FIELD_WIDTH - 0.4, ARENA_HEIGHT - (0.5 + 2.5)),
        new Vector(0.4, ARENA_HEIGHT - (ARENA_HEIGHT - (0.5 + 2.5))),
        new Animation("l_driver_wall", Sprite.black), 1, function(){}, -1,
        [
            new Collision_Box(new Vector(0.4, ARENA_HEIGHT - (ARENA_HEIGHT - (0.5 + 2.5))), 
                new Vector(0.0, 0.0), [-1])
        ]),
    scale: new Goal_Pair(new Vector(ARENA_WIDTH/2 - 1.55, ARENA_HEIGHT - (0.5 + 2.5)),
        8, GOAL_COMPONENT.TYPE.SCALE),
    l_switch: new Goal_Pair(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + 3.2, ARENA_HEIGHT - (0.5 + 0.5)),
        2, GOAL_COMPONENT.TYPE.SWITCH),
    r_switch: new Goal_Pair(new Vector(RIGHT_WALL - (6.3), ARENA_HEIGHT - (0.5 + 0.5)),
        2, GOAL_COMPONENT.TYPE.SWITCH),
    l_cube_stack: new Cube_Stack(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + 0.4 + 6.0, ARENA_HEIGHT - (0.5 + 0.96)), 1),
    r_cube_stack: new Cube_Stack(new Vector(RIGHT_WALL - 0.4 - 7.05, ARENA_HEIGHT - (0.5 + 0.96)), 1),
    l_portal: new Portal(new Vector(DISTANCE_BEHIND_DRIVER_WALLS + 0.4, ARENA_HEIGHT - (0.5 + 1.2)), 2),
    r_portal: new Portal(new Vector(RIGHT_WALL - 0.4 - 1.05, ARENA_HEIGHT - (0.5 + 1.2)), 2),
    score_timeline: new Timeline(false)
};

function update_score_with_ownership (goal_pair,
        allience_side=ALLIENCE_TYPE_NEITHER) {
    var text_rise_duration = 3.0;
    var text_rise_position = new Vector(0.0, 2.2);
    var score_ind = null;
    switch(goal_pair.get_ownership()){
    case ALLIENCE_TYPE.BLUE:
        if(ALLIENCE_TYPE.BLUE == allience_side ||
            ALLIENCE_TYPE.NEITHER == allience_side){
            // If this isnt the opponents goal
            Arena.scoring.blue = Arena.scoring.blue + 1;
            score_ind = new World_Text(goal_pair.blue_component.position.add(new Vector(0.4, -0.6)),
                0.5, "+1", "#0000ff");
        } else {
            score_ind = new World_Text(goal_pair.blue_component.position.add(new Vector(0.4, -0.6)),
            0.5, "+0", "#0000ff");
        }
        break;
    case ALLIENCE_TYPE.RED:
        if(ALLIENCE_TYPE.RED == allience_side ||
            ALLIENCE_TYPE.NEITHER == allience_side){
            // If this isnt the opponents goal
            Arena.scoring.red = Arena.scoring.red + 1;
            score_ind = new World_Text(goal_pair.red_component.position.add(new Vector(0.4, -0.6)),
                0.5, "+1", "#ff0000");
        } else {
            score_ind = new World_Text(goal_pair.red_component.position.add(new Vector(0.4, -0.6)),
            0.5, "+0", "#ff0000");
        }
        break;
    default:
        break;
    }
    if(score_ind != null){
        var id = score_ind.id;
        exploration.scene.add_renderable(score_ind);
        var point_float_sequence = new Sequence();
        point_float_sequence.add_lerp(new Lerp(0.0, text_rise_duration, text_rise_position,
                                 [score_ind]));
        point_float_sequence.add_event(text_rise_duration, function(){
            exploration.scene.remove_renderable_id(id);
        });
        point_float_sequence.start();
    }
}
Arena.score_timeline.add_event(1.0, function(){
    Arena.score_timeline.reset();
    update_score_with_ownership(Arena.l_switch, ALLIENCE_TYPE.BLUE);
    update_score_with_ownership(Arena.r_switch, ALLIENCE_TYPE.RED);
    update_score_with_ownership(Arena.scale, ALLIENCE_TYPE.NEITHER);
    Arena.blue_score.set_text(Arena.scoring.blue);
    Arena.red_score.set_text(Arena.scoring.red);

    Arena.countdown -= 1;
    Arena.countdown_text.set_text(Arena.countdown);

    if(Arena.countdown == 0){
        Arena.score_timeline.stop();
        if(Arena.scoring.blue > Arena.scoring.red){
            Arena.win_text.set_text("BLUE Wins!");
        } else if(Arena.scoring.blue < Arena.scoring.red){
            Arena.win_text.set_position(Arena.win_text.position.add(new Vector(0.1, 0.0)));
            Arena.win_text.set_text("RED Wins!");
        } else {
            Arena.win_text.set_position(Arena.win_text.position.add(new Vector(0.2, 0.0)));
            Arena.win_text.set_text("Tie!");
        }
        exploration.scene.add_renderable(Arena.win_text);
    }
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
    Arena.r_cube_stack,
    Arena.l_portal,
    Arena.r_portal
    ]);
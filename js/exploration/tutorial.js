const DISTANCE_BEHIND_TUTORIAL_DRIVER_WALLS = 2.0;
const TUTORIAL_FIELD_WIDTH = 40.0;
const TUTORIAL_RIGHT_WALL = TUTORIAL_FIELD_WIDTH + DISTANCE_BEHIND_TUTORIAL_DRIVER_WALLS;
const TUTORIAL_WIDTH = TUTORIAL_FIELD_WIDTH + DISTANCE_BEHIND_TUTORIAL_DRIVER_WALLS * 2;
const TUTORIAL_HEIGHT = TUTORIAL_WIDTH * canvas_dimensions.aspect_ratio.multiplier;

function tutorial_viewport_update () {
    Viewport.size.x = TUTORIAL_WIDTH * 0.2;
    Viewport.size.y = TUTORIAL_HEIGHT * 0.2;

    var horizontal_center = robot.position.x + robot.size.x/2;
    horizontal_center = Math.min(horizontal_center, TUTORIAL_WIDTH - 5.0);
    horizontal_center = Math.max(horizontal_center, 5.0);
    var offset = new Vector(Viewport.size.x / 2.0 - horizontal_center,
        0.0);

    Viewport.offset.x = offset.x;
    Viewport.offset.y = offset.y + (TUTORIAL_HEIGHT * 0.8);
    Viewport.offset = Viewport.offset.scale(canvas.width / curr_scene.inside_dimensions.x);
}
var Tutorial = {
    active: false,
    map: new Map(TUTORIAL_WIDTH, new Actor(new Vector(0.0, 0.0), new Vector(TUTORIAL_WIDTH, TUTORIAL_HEIGHT),
                new Animation("TUTORIAL Background", Sprite.arena_background)),
        function(){
            Tutorial.active = true;

            Viewport.set_update(tutorial_viewport_update);

            Tutorial.score_timeline.reset();

            exploration.scene.add_renderable(team_number);
            exploration.scene.add_renderable(Tutorial.move_text);
            exploration.scene.add_renderable(Tutorial.pickup_text);
            exploration.scene.add_renderable(Tutorial.pickup_text_2);
            exploration.scene.add_renderable(Tutorial.place_text);
            exploration.scene.add_renderable(Tutorial.place_text_2);
            exploration.scene.add_renderable(Tutorial.launch_text);
            exploration.scene.add_renderable(Tutorial.score_text);
            exploration.scene.add_renderable(Tutorial.score_text_2);
            exploration.scene.add_renderable(Tutorial.score_text_3);
            exploration.scene.add_renderable(Tutorial.exit_text);
            exploration.scene.add_renderable(Tutorial.portal.cube);
            Tutorial.cube_stack_1.add_cubes_to_scene();
            Tutorial.cube_stack_2.add_cubes_to_scene();
        }),
    score_timeline: new Timeline(),
    ground: new Actor(new Vector(0.0, TUTORIAL_HEIGHT - 0.5),
        new Vector(TUTORIAL_WIDTH, 0.5), new Animation("Still Ground", Sprite.black),
        1, function(){}, -1,
        [
            new Collision_Box(new Vector(TUTORIAL_WIDTH, 0.5),
                new Vector(0.0, 0.0), [-1])
        ]),
    r_driver_wall: new Actor(new Vector(DISTANCE_BEHIND_TUTORIAL_DRIVER_WALLS, TUTORIAL_HEIGHT - (0.5 + 2.5)),
        new Vector(0.4, TUTORIAL_HEIGHT - (TUTORIAL_HEIGHT - (0.5 + 2.5))),
        new Animation("r_driver_wall", Sprite.black), 1, function(){}, -1,
        [
            new Collision_Box(new Vector(0.4, TUTORIAL_HEIGHT - (TUTORIAL_HEIGHT - (0.5 + 2.5))), 
                new Vector(0.0, 0.0), [-1])
        ]),
    l_driver_wall: new Actor(new Vector(DISTANCE_BEHIND_TUTORIAL_DRIVER_WALLS + TUTORIAL_FIELD_WIDTH - 0.4, TUTORIAL_HEIGHT - (0.5 + 2.5)),
        new Vector(0.4, TUTORIAL_HEIGHT - (TUTORIAL_HEIGHT - (0.5 + 2.5))),
        new Animation("l_driver_wall", Sprite.black), 1, function(){}, -1,
        [
            new Collision_Box(new Vector(0.4, TUTORIAL_HEIGHT - (TUTORIAL_HEIGHT - (0.5 + 2.5))), 
                new Vector(0.0, 0.0), [-1])
        ]),
    move_text: new World_Text(new Vector(3.0, TUTORIAL_HEIGHT - (0.5 + 1.9)), 0.2,
        "The A key moves left, D moves right",
        "#000000"),
    pickup_text: new World_Text(new Vector(9.0, TUTORIAL_HEIGHT - (0.5 + 1.9)), 0.2,
        "The T key will pick up a cube",
        "#000000"),
    pickup_text_2: new World_Text(new Vector(9.0, TUTORIAL_HEIGHT - (0.5 + 1.65)), 0.2,
        "from a Portal or Cube Stack",
        "#000000"),
    portal: new Portal(new Vector(9.7, TUTORIAL_HEIGHT - (0.5 + 1.2)), 2),
    cube_stack_1: new Cube_Stack(new Vector(11, TUTORIAL_HEIGHT - (0.5 + 0.96)), 2),
    place_text: new World_Text(new Vector(14.0, TUTORIAL_HEIGHT - (0.5 + 1.9)), 0.2,
        "Press Q to place a cube on a Switch",
        "#000000"),
    place_text_2: new World_Text(new Vector(14.0, TUTORIAL_HEIGHT - (0.5 + 1.65)), 0.2,
        "(You put cubes on the blue goals)",
        "#000000"),
    switch: new Goal_Pair(new Vector(14.5, TUTORIAL_HEIGHT - (0.5 + 0.5)), 3, GOAL_COMPONENT.TYPE.SWITCH),
    cube_stack_2: new Cube_Stack(new Vector(19, TUTORIAL_HEIGHT - (0.5 + 0.96)), 2),
    launch_text: new World_Text(new Vector(20.5, TUTORIAL_HEIGHT - (0.5 + 1.9)), 0.2,
        "Press E to chuck a cube onto the Scale",
        "#000000"),
    scale: new Goal_Pair(new Vector(21.5, TUTORIAL_HEIGHT - (0.5 + 2.5)), 8, GOAL_COMPONENT.TYPE.SCALE),
    score_text: new World_Text(new Vector(26, TUTORIAL_HEIGHT - (0.5 + 1.9)), 0.2,
        "You score 1 point/sec for each goal",
        "#000000"),
    score_text_2: new World_Text(new Vector(26, TUTORIAL_HEIGHT - (0.5 + 1.65)), 0.2,
        "that has more cubes on the blue side.",
        "#000000"),
    score_text_3: new World_Text(new Vector(26, TUTORIAL_HEIGHT - (0.5 + 1.4)), 0.2,
        "You don't gain points from the right-most goal",
        "#000000"),
    exit_text: new World_Text(new Vector(32, TUTORIAL_HEIGHT - (0.5 + 1.65)), 0.2,
        "Enter the green square to start the match",
        "#000000"),
    exit: new Actor(new Vector(35, TUTORIAL_HEIGHT - (0.5 + 1.0)), new Vector(3.0, 1.0),
        new Animation("exit", Sprite.green), 1, function(){}, -1, [
            new Collision_Box(new Vector(3.0, 1.0), new Vector(0.0, 0.0),
                [])
        ])
};
function end_tutorial () {
    if(Tutorial.active){
        Tutorial.active = false;
        Arena.map.set(new Vector(3.0, ARENA_HEIGHT - (0.5 + 0.8)));
    }
}
function update_tutorial_score_with_ownership (goal_pair) {
    var text_rise_duration = 3.0;
    var text_rise_position = new Vector(0.0, 2.2);
    var score_ind = null;
    switch(goal_pair.get_ownership()){
    case ALLIENCE_TYPE.BLUE:
        score_ind = new World_Text(goal_pair.blue_component.position.add(new Vector(0.4, -0.6)),
            0.5, "+1", "#0000ff");
        break;
    case ALLIENCE_TYPE.RED:
        score_ind = new World_Text(goal_pair.red_component.position.add(new Vector(0.4, -0.6)),
            0.5, "+1", "#ff0000");
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
Tutorial.score_timeline.add_event(1.0, function(){
    Tutorial.score_timeline.reset();
    update_tutorial_score_with_ownership(Tutorial.switch);
    update_tutorial_score_with_ownership(Tutorial.scale);
});

var exit_trigger = function(){
    return robot.physics_state.intersects(Tutorial.exit.physics_state);
}
Tutorial.map.set_events([
    new Event(exit_trigger, end_tutorial)
]);
Tutorial.map.set_actors([
    robot,
    Tutorial.ground,
    Tutorial.r_driver_wall,
    Tutorial.l_driver_wall,
    Tutorial.portal,
    Tutorial.cube_stack_1,
    Tutorial.switch.blue_component,
    Tutorial.switch.red_component,
    Tutorial.cube_stack_2,
    Tutorial.scale.blue_component,
    Tutorial.scale.red_component,
    Tutorial.exit
]);
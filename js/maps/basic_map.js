const Basic_Size = new Vector(16.0, 16.0 * canvas_dimensions.aspect_ratio.multiplier);

var Basic = {
    map: new Map(Basic_Size.x, function(){
        Basic.spinny.timer.start();
    }),
    ground: new Actor(new Vector(0.0, Basic_Size.y - 0.5),
                new Vector(Basic_Size.x, 0.5), new Animation("Still Ground", Sprite.black),
                    1, [-1], -1),
    r_wall: new Actor(new Vector(0.0, 0.0), new Vector(0.4, Basic_Size.y - 0.5),
        new Animation("r_wall", Sprite.black), 1, [-1], -1),
    l_wall: new Actor(new Vector(16.0 - 0.4, 0.0), new Vector(0.4, Basic_Size.y - 0.5),
        new Animation("r_wall", Sprite.black), 1, [-1], -1),
    switch: new Switch(new Vector(3.0, Basic_Size.y - (0.5 + 0.5)), 1),
    scale: new Scale(new Vector(6.0, Basic_Size.y - (0.5 + 2.5)), 1),
    cube_stack: new Cube_Stack(new Vector(0.4, Basic_Size.y - (0.5 + 0.66)), 1),
    spinny: {
        robot: new Robot(new Vector(10.0, Basic_Size.y - (0.5 + 0.3)), 
            new Vector(1.0, 0.3), new Animation("Spinny Anim", Sprite.red), 2, 20.0),
        timer: new Timeline(false),
        curr_spin_duration: Math.random() * 3.0,
        curr_spin: 0
    }
};

function spinny_ai () {
    var spinny_speed = 0.4 * Basic.spinny.robot.mass;

    if(Basic.spinny.timer.get_elapsed_time() > Basic.spinny.curr_spin_duration){
        Basic.spinny.timer.reset();
        Basic.spinny.curr_spin_duration = Math.random() * 3.0;
        Basic.spinny.curr_spin = Math.abs(Basic.spinny.curr_spin - 1);
    }
    if(Basic.spinny.timer.get_elapsed_time() > 0.5 * Basic.spinny.curr_spin_duration){
        spinny_speed *= -1.0;
    }
    switch(Basic.spinny.curr_spin){
    case 0:
        Basic.spinny.robot.impulse_force(new Vector(spinny_speed, 0.0));
        break;
    case 1:
        Basic.spinny.robot.impulse_force(new Vector(-spinny_speed, 0.0));
        break;
    }
}
Basic.spinny.robot.set_ai(spinny_ai);

Basic.map.set_actors([Basic.ground,
    Basic.r_wall,
    Basic.l_wall,
    robot,
    Basic.spinny.robot,
    Basic.switch,
    Basic.scale,
    Basic.cube_stack]);
var Spinny = {
    robot: new Robot(new Vector(0.0, 0.0), new Vector(1.0, 0.3),
                new Animation("Spinny Anim", Sprite.red), 4, 1, [
                    new Collision_Box(new Vector(1.0, 0.3),
                        new Vector(0.0, 0.0), [-1])
                ], ALLIENCE.OPPONENT),
    speed: 0.4,
    timer: new Timeline(false),
    curr_spin_duration: Math.random() * 3.0,
    spin_state: 0
}

function spinny_ai () {
    var move_speed = Spinny.speed * Spinny.robot.physics_state.mass;

    if(Spinny.timer.get_elapsed_time() > Spinny.curr_spin_duration){
        Spinny.timer.reset();
        Spinny.curr_spin_duration = Math.random() * 3.0;
        Spinny.spin_state = Math.abs(Spinny.spin_state - 1);
        Spinny.robot.impulse_force(Spinny.robot.get_force().scale(-1));
    }
    if(Spinny.timer.get_elapsed_time() > 0.5 * Spinny.curr_spin_duration){
        move_speed *= -1.0;
    }
    switch(Spinny.spin_state){
    case 0:
        Spinny.robot.impulse_force(new Vector(move_speed, 0.0));
        break;
    case 1:
        Spinny.robot.impulse_force(new Vector(-move_speed, 0.0));
        break;
    }

    Spinny.robot.pickup();
    if(Spinny.robot.physics_state.intersects(Arena.r_switch.opp_side.physics_state)){
        Spinny.robot.place();
        console.log("attempting spinny place");
    }
}
Spinny.robot.set_ai(spinny_ai);
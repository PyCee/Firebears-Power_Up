var Spinny = {
    robot: new Robot(new Vector(0.0, 0.0), new Vector(1.0, 0.3),
                new Animation("Spinny Anim", Sprite.spinny),
                new Animation("Spinny Anim", Sprite.spinny, [[1, 0]], 1, -1), 4, 1, [
                    new Collision_Box(new Vector(1.0, 0.3),
                        new Vector(0.0, 0.0), [-1])
                ], ALLIENCE_TYPE.RED),
    speed: 0.4,
    timer: new Timeline(false),
    place_timer: new Timeline(false), // Can only place a cube down every 3 seconds
    curr_spin_duration: Math.random() * 4.0,
    spin_state: 0
}

function spinny_ai () {
    var move_speed = Spinny.speed * Spinny.robot.physics_state.mass;

    if(Spinny.timer.get_elapsed_time() > Spinny.curr_spin_duration){
        Spinny.timer.reset();
        Spinny.curr_spin_duration = 1.0 + Math.random() * 4.0;
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
    var last_cube = Spinny.robot.cube;
    Spinny.robot.pickup();
    if(last_cube == null && Spinny.robot.cube != null){
        Spinny.place_timer.start();
    }
    if(Spinny.place_timer.get_elapsed_time() >= 3.0){
        Spinny.place_timer.reset();
        Spinny.place_timer.stop();
    }
    if(!Spinny.place_timer.is_active()){
        if(Spinny.robot.physics_state.intersects(Arena.r_switch.red_component.physics_state) ||
            Spinny.robot.physics_state.intersects(Arena.l_switch.red_component.physics_state)){
            Spinny.robot.place();
        }
    }
}
Spinny.robot.set_ai(spinny_ai);
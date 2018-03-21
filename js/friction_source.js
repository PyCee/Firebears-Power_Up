class Friction_Source {
    constructor (frict, specialty_id=-1) {
        this.frict = frict;
        this.specialty_id = specialty_id;
    }
    get_friction () {
        return this.frict;
    }
    get_specialty_id () {
        return this.specialty_id;
    }
}
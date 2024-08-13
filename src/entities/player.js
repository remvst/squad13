class Player extends Character {
    cycle(elapsed) {
        // console.log(elapsed);
        this.x += 100 * elapsed;
    }
}

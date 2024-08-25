class Prisoner extends Entity {
    constructor() {
        super();
        this.buckets.push('human', 'prisoner');
        this.radius = 10;

        this.grabbingLadderRatio = 0;
    }

    explode() {
        this.world.remove(this);

        // Just in case, get off the ladder
        const player = firstItem(this.world.bucket('player'));
        if (player.hangingPrisoner === this) {
            player.hangingPrisoner = null;
        }
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        const player = firstItem(this.world.bucket('player'));

        if (player) {
            // Run towards the player
            if (dist(player, this) < 200) {
                let obstacle = null;
                for (const candidate of this.world.bucket('obstacle')) {
                    if (candidate.directionY < 0) continue;
                    if (!isBetween(candidate.minX, this.x, candidate.maxX)) continue;
                    obstacle = candidate;
                }

                if (!obstacle) return;

                this.x += between(
                    -elapsed * 10,
                    player.x - this.x,
                    elapsed * 10,
                );
                this.x = between(obstacle.minX, this.x, obstacle.maxX);
                this.y = obstacle.yAt(this.x) - this.radius;
            }

            // Grab the ladder
            if (!player.hangingPrisoner && abs(player.x - this.x) < 20 && isBetween(player.y, this.y, player.y + player.ladderLength)) {
                this.grabbingLadderRatio += elapsed * 2;

                if (this.grabbingLadderRatio > 1) {
                    player.hangingPrisoner = this;
                    player.ladderLength = this.y - player.y;

                    // sound(...[,,618,.01,.13,.11,1,3.1,,2,174,.05,.09,,,,,.58,.27]); // Powerup 216
                    // sound(...[1.2,,800,.06,.19,.12,,.4,,,361,.06,.08,,,,.05,.52,.27,.18,140]); // Powerup 251
                    // sound(...[1.2,,258,.05,.28,.28,1,3.2,,,45,.07,.06,,,,.07,.99,.27]); // Powerup 261
                    sound(...[.6,,370,.01,.01,.13,,.9,40,76,,,,,,,,.91,.03,,925]); // Jump 279
                }
            } else {
                this.grabbingLadderRatio = 0;
            }

            // Climb with the ladder
            if (player.hangingPrisoner === this) {
                this.x = player.x;
                this.y = player.y + player.ladderLength;

                if (dist(player, this) < 20) {
                    player.hangingPrisoner = null;
                    player.rescuedPrisoners++;
                    this.world.remove(this);

                    // sound(...[1.1,,600,.05,.03,,,4,,,291,.09,,,,,,.79,.01]); // Pickup 373
                    sound(...[1.2,,529,.06,.19,.12,,.4,,,361,.06,.08,,,,.05,.52,.27,.18,140]); // Loaded Sound 375
                }
            }
        }
    }

    render() {
        ctx.wrap(() => {
            ctx.translate(this.x, this.y);

            ctx.fillStyle = '#0f0'
            ctx.fillRect(-5, -10, 10, 20);
            ctx.fillRect(-5, 10, 3, 4);
            ctx.fillRect(5, 10, -3, 4);
        })
    }
}

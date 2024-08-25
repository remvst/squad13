class Prisoner extends Entity {
    constructor() {
        super();
        this.buckets.push('human', 'prisoner');
        this.radius = 10;
    }

    explode() {
        this.world.remove(this);
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
                    -elapsed * 20,
                    player.x - this.x,
                    elapsed * 20,
                );
                this.x = between(obstacle.minX, this.x, obstacle.maxX);
                this.y = obstacle.yAt(this.x) - this.radius;
            }

            // Grab the ladder
            const ladderY = player.y + player.ladderLength;
            if (abs(player.x - this.x) < 10 && isBetween(player.y, this.y, ladderY)) {
                player.hangingPrisoner = this;
                player.ladderLength = this.y - player.y;
            }

            // Climb with the ladder
            if (player.hangingPrisoner === this) {
                this.x = player.x;
                this.y = ladderY;

                if (dist(player, this) < 20) {
                    player.hangingPrisoner = null;
                    this.world.remove(this);
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

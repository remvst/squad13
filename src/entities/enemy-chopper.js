class EnemyChopper extends Chopper {

    constructor() {
        super(-1);

        this.reachedTarget = false;
        this.path = [];
    }

    follow(path) {
        this.path = path;
        return this;
    }

    render(camera) {
        super.render(camera);

        // const target = this.path[0];
        // if (target) {
        //     ctx.strokeStyle = '#00f';
        //     ctx.lineWidth = 4;
        //     ctx.beginPath();
        //     ctx.moveTo(this.x, this.y);
        //     ctx.lineTo(target.x, target.y);
        //     ctx.stroke();
        // }
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.controls.up = false;
        this.controls.left = false;
        this.controls.right = false;

        const target = this.path[0]
        if (!target) return;

        const distToTarget = dist(target, this);

        // if (distToTarget < 10) {
        //     this.reachedTarget = true;

        //     this.path.push(this.path.shift());
        // } else if (distToTarget > 100) {
        //     this.reachedTarget = false;
        // }

        if (distToTarget > 10) {
            const future = this.futurePosition();
            this.controls.right = future.x < target.x;
            this.controls.left = future.x > target.x;
            this.controls.up = future.y > target.y;
        } else {
            this.path.push(this.path.shift());
        }
    }
}

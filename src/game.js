class Game {
    constructor() {
        this.world = new World();

        this.age = 0;

        (async () => {
            const levels = [
                tutorialFly,
                firstMountain,
                mountainThenCeiling,
                tutorialShoot,
                caveThenCeiling,
                lowCeiling,
                hardMountains,
                smallMountainSuccession,
                upAndDown,
            ]
            let levelIndex = 0;
            let attemptIndex = 0;
            let startTime = this.age;
            let missionStartTime = this.age;

            while (levelIndex < levels.length) {
                if (this.world) this.world.destroy();
                this.world = new World();

                const level = levels[levelIndex];
                try {
                    const levelPromise = level(this.world);

                    this.world.add(new ProgressIndicator(() => ([
                        ['MISSION', `${levelIndex + 1}/${levels.length}`],
                        ['TIME', formatTime(this.age - missionStartTime)],
                        ['OVERALL', formatTime(this.age - startTime)],
                    ])));
                    this.world.add(new Transition(-1));

                    if (attemptIndex++ === 0) {
                        this.world.add(new Title('THE 13TH SQUAD').fade(1, 0, 1, 2));
                    }

                    await levelPromise;
                    this.world.add(new Title('MISSION\nSUCCESS', '#fff').fade(0, 1, 0.2, 0));
                    await new Promise(r => setTimeout(r, 2000));
                    levelIndex++;
                    missionStartTime = this.age;
                } catch (err) {
                    console.error(err);
                    this.world.add(new Title('MISSION\nFAILED', '#f00').fade(0, 1, 0.2, 0));
                    await new Promise(r => setTimeout(r, 1000));
                }

                const transitionOut = new Transition(1);
                this.world.add(transitionOut);
                await this.world.waitFor(() => transitionOut.age > 0.3);
            }

            alert('Thanks for playing! Final time: ' + formatTime(this.age));
            location.reload();
        })();
    }

    cycle(elapsed) {
        this.age += elapsed;

        this.world.cycle(Math.min(elapsed, 1 / 30));
        this.world.render();

        // if (DEBUG) {
        //     ctx.fillStyle = '#fff';
        //     ctx.strokeStyle = '#000';
        //     ctx.textAlign = 'left';
        //     ctx.textBaseline = 'bottom';
        //     ctx.font = '14pt Courier';
        //     ctx.lineWidth = 3;

        //     let y = CANVAS_HEIGHT - 10;
        //     for (const line of [
        //         'FPS: ' + ~~(1 / elapsed),
        //         'Entities: ' + this.world.entities.size,
        //     ].reverse()) {
        //         ctx.strokeText(line, 10, y);
        //         ctx.fillText(line, 10, y);
        //         y -= 20;
        //     }
        // }
    }
}

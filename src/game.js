class Game {
    constructor() {
        this.world = new World();

        this.age = 0;

        (async () => {
            let loopId = 0;
            while (true) {
                await this.gameLoop();
            }
        })();
    }

    async gameLoop() {
        const levels = [
            // tutorialFly,
            // firstMountain,
            // mountainThenCeiling,
            // tutorialShoot,
            // caveThenCeiling,
            // lowCeiling,
            // hardMountains,
            // smallMountainSuccession,
            nightMountains,
            upAndDown,
        ]
        let levelIndex = 0;
        let attemptIndex = 0;
        let startTime = this.age;
        let missionStartTime = this.age;
        let totalDeaths = 0;

        const totalPrisoners = levels.reduce((sum, level) => {
            const world = new World();
            level(world);
            return sum + Array.from(world.bucket('prisoner')).length;
        }, 0);
        let totalRescuedPrisoners = 0;

        while (levelIndex < levels.length) {
            if (this.world) this.world.destroy();
            this.world = new World();

            const level = levels[levelIndex];
            try {
                const levelPromise = level(this.world);
                const missionPrisoners = Array.from(this.world.bucket('prisoner')).length;

                this.world.add(new ProgressIndicator(() => {
                    const player = firstItem(this.world.bucket('player'));
                    return [
                        ['MISSION', `${levelIndex + 1}/${levels.length}`],
                        ['PRISONERS', (player ? player.rescuedPrisoners : 0) + '/' + missionPrisoners],
                        ['TIME', formatTime(this.age - missionStartTime)],
                        ['OVERALL', formatTime(this.age - startTime)],
                    ];
                }));
                this.world.add(new Transition(-1));

                if (attemptIndex++ === 0) {
                    const title = new Title('THE 13TH SQUAD')
                    this.world.add(title);

                    this.world.add(new StartPrompt('PRESS [SPACE] TO DEPLOY'));
                    await this.world.waitFor(() => !firstItem(this.world.bucket('start-prompt')));

                    playSong();

                    title.fade(1, 0, 1, 0.3);

                    startTime = this.age;
                }

                await levelPromise;

                const player = firstItem(this.world.bucket('player'));
                if (player) {
                    totalRescuedPrisoners += player.rescuedPrisoners;
                }

                this.world.add(new Title('MISSION\nSUCCESS', '#fff').fade(0, 1, 0.2, 0));
                await new Promise(r => setTimeout(r, 2000));
                levelIndex++;
                missionStartTime = this.age;

            } catch (err) {
                totalDeaths++;
                console.log(err);
                this.world.add(new Title('MISSION\nFAILED', '#f00').fade(0, 1, 0.2, 0));
                await new Promise(r => setTimeout(r, 1000));
            }

            const transitionOut = new Transition(1);
            this.world.add(transitionOut);
            await this.world.waitFor(() => transitionOut.age > 0.3);
        }

        this.world.destroy();

        const totalTime = formatTime(this.age - startTime);
        this.world.add(new Title('THX FOR PLAYING', '#fff').fade(0, 1, 0.2, 0));
        this.world.add(new RunRecap(() => {
            return [
                ['TOTAL TIME', totalTime],
                ['RESCUED PRISONERS', `${totalRescuedPrisoners}/${totalPrisoners}`],
                ['CRASHES', `${totalDeaths}`],
            ]
        }));

        this.world.add(new StartPrompt('PRESS [SPACE] TO REDEPLOY'));
        await this.world.waitFor(() => !firstItem(this.world.bucket('start-prompt')));
    }

    cycle(elapsed) {
        this.age += elapsed;

        this.world.cycle(Math.min(elapsed, 1 / 30));
        this.world.render();

        if (DEBUG) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.font = '14pt Courier';
            ctx.lineWidth = 3;

            let y = CANVAS_HEIGHT - 10;
            for (const line of [
                'FPS: ' + ~~(1 / elapsed),
                'Entities: ' + this.world.entities.size,
            ].reverse()) {
                ctx.strokeText(line, 10, y);
                ctx.fillText(line, 10, y);
                y -= 20;
            }
        }
    }
}

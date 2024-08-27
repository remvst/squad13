class Game {
    constructor() {
        this.world = new World();

        this.age = 0;
        this.easyMode = false;

        if (SCREENSHOT) {
            CANVAS_WIDTH = 4096;
            CANVAS_HEIGHT = 4096;
            can.width = CANVAS_WIDTH;
            can.height = CANVAS_HEIGHT;

            const world = new World();

            const camera = firstItem(world.bucket('camera'));
            camera.zoom = 20;

            const chopper = new Chopper();
            chopper.angle = PI / 6;
            chopper.age = -0.01;
            world.add(chopper);

            world.render();

            throw new Error('plz taek screenshot');
        }

        (async () => {
            while (true) {
                await this.gameLoop();
            }
        })();
    }

    async gameLoop() {
        const levels = [
            tutorialFly,
            // firstMountain,
            // mountainThenCeiling,
            // tutorialShoot,
            // caveThenCeiling,
            // lowCeiling,
            // mountainChopperCeilingChopper,
            // hardMountains,
            // smallMountainSuccession,
            // nightMountains,
            // upAndDown,
        ]
        let levelIndex = 0;
        let attemptIndex = 0;
        let startTime = this.age;
        let missionStartTime = this.age;
        let totalDeaths = 0;
        let wasEverEasy = false;

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
                    player.simplifiedPhysics = this.easyMode;

                    wasEverEasy = wasEverEasy || this.easyMode;

                    return [
                        ['MISSION', `${levelIndex + 1}/${levels.length}`],
                        ['PRISONERS', (player ? player.rescuedPrisoners : 0) + '/' + missionPrisoners],
                        ['TIME', formatTime(this.age - missionStartTime)],
                        ['OVERALL', formatTime(this.age - startTime)],
                        ['DIFFICULTY [K]', this.easyMode ? 'EASY' : 'NORMAL'],
                    ];
                }));
                this.world.add(new Transition(-1));

                if (attemptIndex++ === 0) {
                    const title = new Title('SQUAD 13')
                    this.world.add(title);

                    this.world.add(new StartPrompt('PRESS [SPACE] TO DEPLOY'));
                    await this.world.waitFor(() => !firstItem(this.world.bucket('start-prompt')));

                    console.log('reset!');
                    wasEverEasy = false;

                    playSong();

                    title.fade(1, 0, 1, 0.3);

                    startTime = this.age;
                }

                await levelPromise;

                const player = firstItem(this.world.bucket('player'));
                if (player) totalRescuedPrisoners += player.rescuedPrisoners;

                if (levelIndex === 0) {
                    const transitionOut = new Transition(1);
                    this.world.add(transitionOut);
                    await this.world.waitFor(() => transitionOut.age > 0.3);
                    this.world.destroy();

                    {
                        this.world = new World();
                        const exposition = new Exposition([
                            'When all hope is lost, the World Police Organization sends SQUAD 13.',
                            'They are tasked with the most dangerous missions.',
                        ]);
                        this.world.add(exposition);

                        await exposition.complete();
                        await exposition.agesBy(1);
                    }

                    {
                        this.world = new World();
                        const exposition = new Exposition([
                            'SQUAD 13 is feared even by the most wicked evil terrorists.',
                            'This is their story.',
                        ]);
                        this.world.add(exposition);

                        await exposition.complete();
                        await exposition.agesBy(1);
                    }
                } else {
                    const title = new Title('MISSION\nSUCCESS', '#fff').fade(0, 1, 0.2, 0);
                    this.world.add(title);
                    await title.agesBy(1);
                }

                // Move on to the next level
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
                ['DIFFICULTY', wasEverEasy ? 'EASY' : 'NORMAL'],
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

            const player = firstItem(this.world.bucket('player'));

            let y = CANVAS_HEIGHT - 10;
            for (const line of [
                'FPS: ' + ~~(1 / elapsed),
                'Entities: ' + this.world.entities.size,
                'Player: ' + (player ? `${~~player.x},${~~player.y}` : ''),
            ].reverse()) {
                ctx.strokeText(line, 10, y);
                ctx.fillText(line, 10, y);
                y -= 20;
            }
        }
    }
}

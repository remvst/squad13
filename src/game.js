class Game {
    constructor() {
        this.world = new World();

        this.age = 0;
        this.easyMode = inputMode === INPUT_MODE_TOUCH;

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

    difficultyPrompt(withText) {
        const text = () => withText
            ? nomangle('DIFFICULTY: ') + (this.easyMode ? nomangle('EASY') : nomangle('NORMAL')) + nomangle(' - PRESS [K] TO CHANGE')
            : '';

        const prompt = new StartPrompt(
            text(),
            [75],
            () => {
                this.easyMode = !this.easyMode;
                prompt.text = text();
            },
        );
        return prompt;
    }

    async missionFailed() {
        this.pauseWorld = new World();

        const worldOut = new TransitionOut();
        this.pauseWorld.add(worldOut);
        await worldOut.agesBy(0.3);

        this.paused = true;
        this.world.destroy();

        const title = new Title(nomangle('MISSION\nFAILED'), '#f00');
        this.pauseWorld.add(title);
        title.fade(0, 1, 0.2);
        await title.agesBy(1);

        const transitionOut = new TransitionOut();
        this.pauseWorld.add(transitionOut);
        await transitionOut.agesBy(0.3);

        this.paused = false;
        this.pauseWorld = null;
    }

    async missionSuccess() {
        this.pauseWorld = new World();

        const worldOut = new TransitionOut();
        this.pauseWorld.add(worldOut);
        await worldOut.agesBy(0.3);

        this.paused = true;
        this.world.destroy();

        const title = new Title(nomangle('MISSION\nSUCCESS'), '#fff');
        this.pauseWorld.add(title);
        title.fade(0, 1, 0.2);
        await title.agesBy(1);

        const transitionOut = new TransitionOut();
        this.pauseWorld.add(transitionOut);
        await transitionOut.agesBy(0.3);

        this.paused = false;
        this.pauseWorld = null;
    }

    async titleScreen() {
        this.paused = true;
        this.pauseWorld = new World();

        const title = new Title(nomangle('SQUAD 13'));

        const promptSet = new PromptSet([
            new StartPrompt(
                inputMode === INPUT_MODE_TOUCH
                    ? nomangle('TAP TO DEPLOY')
                    : nomangle('PRESS [SPACE] TO DEPLOY'),
                [32],
                () => {
                    promptSet.world.remove(promptSet);
                },
            ),
            inputMode != INPUT_MODE_TOUCH
                ? this.difficultyPrompt(true)
                : null,
        ]);

        this.pauseWorld.add(
            title,
            promptSet,
            new TransitionIn(),
        );

        await promptSet.removed();
        this.paused = false;
        await title.fade(1, 0, 1, 0.3);

        this.pauseWorld = null;
    }

    pause() {
        if (this.pauseWorld) {
            return;
        }

        this.world.destroy();

        this.paused = true;
        this.pauseWorld = new World();

        const title = new Title(nomangle('PAUSED'), 'rgba(0,0,0,0)', 'rgba(0,0,0,0.95)');

        const promptSet = new PromptSet([
            new StartPrompt(nomangle('PRESS [SPACE] TO RESUME'), [32, 27, 80], () => {
                promptSet.world.remove(promptSet);
            }),
            this.difficultyPrompt(true),
        ]);
        this.pauseWorld.add(title, promptSet);

        (async () => {
            await promptSet.removed();
            this.pauseWorld = null;
            this.paused = false;

            DOWN = {};
        })();
    }

    async gameLoop() {
        const levels = [
            tutorialFly,
            firstMountain,
            mountainThenCeiling,
            tutorialShoot,
            caveThenCeiling,
            lowCeiling,
            mountainChopperCeilingChopper,
            hardMountains,
            smallMountainSuccession,
            nightMountains,
            upAndDown,
        ]
        let levelIndex = 0;
        let attemptIndex = 0;
        let startTime = this.age;
        let missionStartTime = this.age;
        let totalDeaths = 0;
        let wasEverEasy = false;
        let promptedEasyMode = false;
        let missionFailures = 0;

        const totalPrisoners = levels.reduce((sum, level) => {
            const world = new World();
            level(world);
            return sum + Array.from(world.bucket('prisoner')).length;
        }, 0);
        let totalRescuedPrisoners = 0;

        while (levelIndex < levels.length) {
            if (this.world) this.world.destroy();
            this.world = new World();

            // Invisible prompt to change difficulty
            this.world.add(this.difficultyPrompt(false));

            const level = levels[levelIndex];
            try {
                const levelPromise = level(this.world);

                // Force camera to update
                this.world.cycle(0);

                const missionPrisoners = Array.from(this.world.bucket('prisoner')).length;

                if (attemptIndex++ === 0) {
                    await this.titleScreen();
                    startTime = this.age;
                    wasEverEasy = false;
                    startTime = this.age;

                    playSong();
                } else {
                    this.world.add(new TransitionIn());
                }

                if (missionFailures === 0) {
                    missionStartTime = this.age;
                }

                // Invisible prompt to pause the game
                this.world.add(new StartPrompt('', [27, 80], () => {
                    this.pause();
                }));

                this.world.add(new ProgressIndicator(() => {
                    const player = firstItem(this.world.bucket('player'));
                    if (player) player.simplifiedPhysics = this.easyMode;

                    wasEverEasy = wasEverEasy || this.easyMode;

                    return [
                        [nomangle('MISSION'), `${levelIndex + 1}/${levels.length}`],
                        [nomangle('PRISONERS'), (player ? player.rescuedPrisoners : 0) + '/' + missionPrisoners],
                        [nomangle('TIME'), formatTime(this.age - missionStartTime)],
                        [nomangle('OVERALL'), formatTime(this.age - startTime)],
                        [nomangle('DIFFICULTY [K]'), this.easyMode ? nomangle('EASY') : nomangle('NORMAL')],
                    ];
                }));

                if (inputMode === INPUT_MODE_TOUCH) {
                    this.world.add(new MobileControls());
                }

                await levelPromise;

                missionFailures = 0;

                const player = firstItem(this.world.bucket('player'));
                if (player) totalRescuedPrisoners += player.rescuedPrisoners;

                if (levelIndex === 0) {
                    await this.exposition();
                } else {
                    await this.missionSuccess();
                }

                // Move on to the next level
                levelIndex++;

            } catch (err) {
                totalDeaths++;
                missionFailures++;
                console.log(err);

                await new Promise(resolve => setTimeout(resolve, 500));
                await this.missionFailed();

                if (missionFailures % 5 === 0 && !this.easyMode && !promptedEasyMode) {
                    promptedEasyMode = true;
                    if (confirm(nomangle('Enable easy mode? (simplified physics, less aggressive enemies)'))) {
                        this.easyMode = true;
                    }
                }
            }

            // const transitionOut = new Transition(1);
            // this.world.add(transitionOut);
            // await this.world.waitFor(() => transitionOut.age > 0.3);
        }

        this.world.destroy();

        await this.runRecap([
            [nomangle('TOTAL TIME'), formatTime(this.age - startTime)],
            [nomangle('DIFFICULTY'), wasEverEasy ? nomangle('EASY') : nomangle('NORMAL')],
            [nomangle('RESCUED PRISONERS'), `${totalRescuedPrisoners}/${totalPrisoners}`],
            [nomangle('CRASHES'), `${totalDeaths}`],
        ]);
    }

    async exposition() {
        this.pauseWorld = new World();

        const worldOut = new TransitionOut();
        this.pauseWorld.add(worldOut);
        await worldOut.agesBy(0.3);
        this.paused = true;
        this.world.destroy();

        {
            this.pauseWorld = new World();
            const exposition = new Exposition([
                nomangle('When all hope is lost, the World Police Organization sends SQUAD 13.'),
                nomangle('They are tasked with the most dangerous missions.'),
            ]);
            this.pauseWorld.add(exposition);

            await exposition.complete();
            await exposition.agesBy(1);
        }

        {
            this.pauseWorld = new World();
            const exposition = new Exposition([
                nomangle('SQUAD 13 is feared even by the most wicked evil terrorists.'),
                nomangle('This is their story.'),
            ]);
            this.pauseWorld.add(exposition);

            await exposition.complete();
            await exposition.agesBy(1);
        }

        this.paused = false;
        this.pauseWorld = null;
    }

    async runRecap(recap) {
        this.pauseWorld = new World();
        this.paused = true;

        const transitionIn = new Transition(1);
        this.pauseWorld.add(transitionIn);
        await transitionIn.agesBy(0.3);

        const title = new Title(nomangle('THX FOR PLAYING'), '#fff');

        const promptSet = new PromptSet([
            ...recap.map(([label, value]) => new RunRecap(label, value)),
            new StartPrompt(
                inputMode === INPUT_MODE_TOUCH
                    ? nomangle('TAP TO REDEPLOY')
                    : nomangle('PRESS [SPACE] TO REDEPLOY'),
                [32],
                () => promptSet.world.remove(promptSet),
            ),
        ])

        this.pauseWorld.add(title, promptSet);

        await promptSet.removed();

        this.paused = false;
        this.pauseWorld = null;
    }

    cycle(elapsed) {
        this.age += elapsed;

        if (!this.pauseWorld || !this.paused) {
            this.world.cycle(Math.min(elapsed, 1 / 30));
        }

        this.world.render();

        if (this.pauseWorld) {
            this.pauseWorld.cycle(elapsed);
            this.pauseWorld.render();
        }

        if (DEBUG) {
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#000';
            ctx.textAlign = nomangle('left');
            ctx.textBaseline = nomangle('bottom');
            ctx.font = nomangle('14pt Courier');
            ctx.lineWidth = 3;

            const player = firstItem(this.world.bucket('player'));

            let y = CANVAS_HEIGHT - 10;
            for (const line of [
                nomangle('FPS: ') + ~~(1 / elapsed),
                nomangle('Entities: ') + this.world.entities.size,
                nomangle('Player: ') + (player ? `${~~player.x},${~~player.y}` : ''),
            ].reverse()) {
                ctx.strokeText(line, 10, y);
                ctx.fillText(line, 10, y);
                y -= 20;
            }
        }
    }
}

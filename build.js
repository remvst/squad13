const compiler = require('./js13k-compiler/src/compiler');
const spawn = require('child_process').spawn;
const Task = require('./js13k-compiler/src/tasks/task');

class ECTZip extends Task {
    constructor(filename) {
        super();
        this.filename = filename;
    }

    execute(input) {
        return new Promise((resolve, reject) => {
            // Guess I'm hardcoding this :p
            const subprocess = spawn('./Efficient-Compression-Tool/build/ect', [
                '-zip',
                this.filename,
                '-9',
                '-strip',
            ]);

            subprocess.on('exit', (code) => {
                if (code === 0) {
                    resolve(input);
                } else {
                    reject('ect failed with error code ' + code);
                }
            });
        });
    }
}

const CONSTANTS = {
    "true": 1,
    "false": 0,
    "const": "let",
    "null": 0,

    "SONG_VOLUME": 0.3,

    "SCREENSHOT": 0,

    "INPUT_MODE_KEYBOARD": 0,
    "INPUT_MODE_TOUCH": 1,
    "INPUT_MODE_GAMEPAD": 2,
};

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

compiler.run((tasks) => {
    function buildJS({
        mangle,
        uglify
    }) {
        // Manually injecting the DEBUG constant
        const constants = copy(CONSTANTS);
        constants.DEBUG = !uglify;

        const sequence = [
            tasks.label('Building JS'),
            tasks.loadFiles([
                'globals.js',

                'util/first-item.js',
                'util/resizer.js',
                'util/math.js',
                'util/colors.js',
                'util/format-time.js',
                'util/rng.js',
                'util/explosion.js',

                'engine/entity.js',
                'engine/world.js',

                'entities/choppers/chopper.js',
                'entities/choppers/player.js',
                'entities/choppers/enemy-chopper.js',
                'entities/choppers/flashlight.js',

                'entities/environment/obstacle.js',
                'entities/environment/landing-area.js',
                'entities/environment/water.js',

                'entities/decoration/particle.js',
                'entities/decoration/fireball.js',
                'entities/decoration/background.js',
                'entities/decoration/sun.js',
                'entities/decoration/stars.js',
                'entities/decoration/mountains.js',
                'entities/decoration/rain.js',

                'entities/camera.js',
                'entities/missile.js',
                'entities/transition.js',
                'entities/condition.js',

                'entities/human/human.js',
                'entities/human/rebel.js',
                'entities/human/prisoner.js',

                'entities/ui/instruction.js',
                'entities/ui/title.js',
                'entities/ui/start-prompt.js',
                'entities/ui/prompt-set.js',
                'entities/ui/exposition.js',
                'entities/ui/run-recap.js',
                'entities/ui/progress-indicator.js',
                'entities/ui/mobile-controls.js',


                'graphics/wrap.js',
                'graphics/create-canvas.js',
                'graphics/create-canvas-pattern.js',
                'graphics/font.js',

                'sound/ZzFXMicro.js',
                'sound/sonantx.js',
                'sound/song.js',

                'input/keyboard.js',
                'input/mouse.js',
                'input/touch.js',

                'game.js',
                'levels.js',
                'social.js',
                'index.js',
            ].filter(file => !!file).map(file => 'src/' + file)),
            tasks.concat(),
            tasks.constants(constants),
            tasks.macro('evaluate'),
            tasks.macro('nomangle'),
        ];

        if (mangle) {
            sequence.push(tasks.mangle({
                "skip": [
                    "arguments",
                    "callee",
                    "flat",
                    "left",
                    "px",
                    "pt",
                    "movementX",
                    "movementY",
                    "imageSmoothingEnabled",
                    "cursor",
                    "flatMap",
                    "monetization",
                    "yield",
                    "await",
                    "async",
                    "try",
                    "catch",
                    "finally",
                    "padStart",
                    "start",
                    "repeat",
                ],
                "force": [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h",
                    "i",
                    "j",
                    "k",
                    "l",
                    "m",
                    "n",
                    "o",
                    "p",
                    "q",
                    "r",
                    "s",
                    "t",
                    "u",
                    "v",
                    "w",
                    "x",
                    "y",
                    "z",
                    "alpha",
                    "background",
                    "direction",
                    "ended",
                    "key",
                    "level",
                    "maxDistance",
                    "remove",
                    "speed",
                    "item",
                    "center",
                    "wrap",
                    "angle",
                    "target",
                    "path",
                    "step",
                    "color",
                    "expand",
                    "label",
                    "action",
                    "normalize",
                    "duration",
                    "message",
                    "name",
                    "ratio",
                    "index",
                    "controls",
                    "attack",
                    "end",
                    "description",
                    "resolve",
                    "reject",
                    "category",
                    "update",
                    "error",
                    "endTime",
                    "aggressivity",
                    "radiusX",
                    "radiusY",
                    "state",
                    "rotation",
                    "contains",
                    "zoom",
                    "object",
                    "entity",
                    "Entity",
                    "entities",
                    "timeout",
                    "frame",
                    "line",
                    "repeat",
                    "elements",
                    "text",
                    "source",
                    "frequency",
                ]
            }));
        }

        if (uglify) {
            sequence.push(tasks.uglifyES());
            sequence.push(tasks.roadroller());
        }

        return tasks.sequence(sequence);
    }

    function buildCSS(uglify) {
        const sequence = [
            tasks.label('Building CSS'),
            tasks.loadFiles([__dirname + "/src/style.css"]),
            tasks.concat()
        ];

        if (uglify) {
            sequence.push(tasks.uglifyCSS());
        }

        return tasks.sequence(sequence);
    }

    function buildHTML(uglify) {
        const sequence = [
            tasks.label('Building HTML'),
            tasks.loadFiles([__dirname + "/src/index.html"]),
            tasks.concat()
        ];

        if (uglify) {
            sequence.push(tasks.uglifyHTML());
        }

        return tasks.sequence(sequence);
    }

    function buildMain() {
        return tasks.sequence([
            tasks.block('Building main files'),
            tasks.parallel({
                'js': buildJS({
                    'mangle': true,
                    'uglify': true
                }),
                'css': buildCSS(true),
                'html': buildHTML(true)
            }),
            tasks.combine(),
            tasks.output(__dirname + '/build/index.html'),
            tasks.label('Building ZIP'),
            tasks.zip('index.html'),

            // Regular zip
            tasks.output(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),

            // ADV zip
            tasks.advzip(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),

            // ECT zip
            new ECTZip(__dirname + '/build/game.zip'),
            tasks.checkSize(__dirname + '/build/game.zip'),
        ]);
    }

    function buildDebug({
        mangle,
        suffix
    }) {
        return tasks.sequence([
            tasks.block('Building debug files'),
            tasks.parallel({
                // Debug JS in a separate file
                'debug_js': tasks.sequence([
                    buildJS({
                        'mangle': mangle,
                        'uglify': false
                    }),
                    tasks.output(__dirname + '/build/debug' + suffix + '.js')
                ]),

                // Injecting the debug file
                'js': tasks.inject(['debug' + suffix + '.js']),

                'css': buildCSS(false),
                'html': buildHTML(false)
            }),
            tasks.combine(),
            tasks.output(__dirname + '/build/debug' + suffix + '.html')
        ]);
    }

    function main() {
        return tasks.sequence([
            buildDebug({
                'mangle': false,
                'suffix': ''
            }),
            buildDebug({
                'mangle': true,
                'suffix': '_mangled'
            }),
            buildMain(),
        ]);
    }

    return main();
});

import { EVALUATE, NOMANGLE, assembleHtml, hardcodeConstants, macro, mangle } from "@remvst/js13k-tools";
import CleanCSS from 'clean-css';
import { promises as fs } from 'fs';
import { minify as minifyHTML } from 'html-minifier';
import { Packer } from 'roadroller';
import * as terser from 'terser';
import yargs from 'yargs/yargs';

const JS_FILES = [
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

    'sound/ZzFXMicro.js',
    'sound/sonantx.js',
    'sound/song.js',

    'input/keyboard.js',
    'input/mouse.js',
    'input/touch.js',

    'difficulty.js',
    'game.js',
    'levels.js',
    'social.js',
    'index.js',
];

const CONSTANTS = {
    "true": 1,
    "false": 0,
    "const": "let",
    "null": 0,

    "SCREENSHOT": 0,

    "INPUT_MODE_KEYBOARD": 0,
    "INPUT_MODE_TOUCH": 1,
    "INPUT_MODE_GAMEPAD": 2,
};

const MANGLE_PARAMS = {
    "skip": [
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
        "elements",
        "text",
        "source",
        "frequency",
    ]
};

const argv = yargs(process.argv.slice(2)).options({
    debug: { type: 'boolean', default: false },
    mangle: { type: 'boolean', default: false },
    minify: { type: 'boolean', default: false },
    'roadroll-level': { type: 'number', default: 0 },
    pack: { type: 'boolean', default: false },
    html: { type: 'string', demandOption: true },
}).parse();

(async () => {
    let html = await fs.readFile('src/index.html', 'utf-8');
    let css = await fs.readFile('src/style.css', 'utf-8');

    let js = (await Promise.all(
        JS_FILES.map(path => fs.readFile('src/' + path, 'utf-8')))
    ).join('\n');

    js = hardcodeConstants(js, {
        DEBUG: argv.debug,
        ...CONSTANTS,
    });
    js = macro(js, NOMANGLE);
    js = macro(js, EVALUATE);

    if (argv.mangle) {
        console.log('Mangling...');
        js = mangle(js, MANGLE_PARAMS);
    }

    if (argv.minify) {
        console.log('Minifying...');
        js = (await terser.minify(js, {
            mangle: {
                properties: true,
                toplevel: true,
            }
        })).code!;
    }

    if (argv['roadroll-level'] > 0) {
        console.log('Roadrolling (level ' + argv['roadroll-level'] + ')...');
        const packer = new Packer([
            {
                data: js,
                type: 'js',
                action: 'eval',
            },
        ], {
            // see the Usage for available options.
        });
        await packer.optimize(argv['roadroll-level']);
        const { firstLine, secondLine } = packer.makeDecoder();
        js = firstLine + secondLine;
    }

    if (argv.minify) {
        html = minifyHTML(html, {
            collapseWhitespace: true,
            minifyCSS: false,
            minifyJS: false
        });

        css = new CleanCSS().minify(css).styles;
    }

    const finalHtml = assembleHtml({ html, css, js });

    await fs.mkdir('build/', { recursive: true });
    await fs.writeFile(argv.html, finalHtml);
})();

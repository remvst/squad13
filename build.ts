import { EVALUATE, NOMANGLE, assembleHtml, hardcodeConstants, logFileSize, macro, makeZip, mangle } from "@remvst/js13k-tools";
import CleanCSS from 'clean-css';
import { promises as fs } from 'fs';
import { minify as minifyHTML } from 'html-minifier';
import { Packer } from 'roadroller';
import * as terser from 'terser';
import { spawn } from 'child_process';

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
    'graphics/font.js',

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

    "SONG_VOLUME": 0.3,

    "SCREENSHOT": 0,

    "INPUT_MODE_KEYBOARD": 0,
    "INPUT_MODE_TOUCH": 1,
    "INPUT_MODE_GAMEPAD": 2,
};

const MANGLE_PARAMS = {
    "skip": [

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
};

(async () => {
    console.log('Reading input...');
    const html = await fs.readFile('src/index.html', 'utf-8');
    const css = await fs.readFile('src/style.css', 'utf-8');

    const fileContents: string[] = [];
    for (const path of JS_FILES) {
        fileContents.push(await fs.readFile('src/' + path, 'utf-8'));
    }

    let jsCode = (await Promise.all(
        JS_FILES.map(path => fs.readFile('src/' + path, 'utf-8')))
    ).join('\n');

    console.log('debug...');
    let debugJs = jsCode;
    debugJs = hardcodeConstants(debugJs, {
        DEBUG: true,
        ...CONSTANTS,
    });
    debugJs = macro(debugJs, NOMANGLE);
    debugJs = macro(debugJs, EVALUATE);

    console.log('debug+mangled.js...');
    let debugMangledJs = jsCode;
    debugMangledJs = hardcodeConstants(debugMangledJs, {
        DEBUG: true,
        ...CONSTANTS,
    });
    debugMangledJs = macro(debugMangledJs, NOMANGLE);
    debugMangledJs = macro(debugMangledJs, EVALUATE);
    debugMangledJs = mangle(debugMangledJs, MANGLE_PARAMS);

    console.log('prod.js...');
    let prodJs = jsCode;
    prodJs = hardcodeConstants(prodJs, {
        DEBUG: false,
        ...CONSTANTS,
    });
    prodJs = macro(prodJs, NOMANGLE);
    prodJs = macro(prodJs, EVALUATE);
    prodJs = mangle(prodJs, {
        force: [],
        skip: [],
        minLength: 2,
    })
    prodJs = (await terser.minify(prodJs)).code!;

    console.log('packer...');
    const packer = new Packer([
        {
            data: prodJs,
            type: 'js',
            action: 'eval',
        },
    ], {
        // see the Usage for available options.
    });
    await packer.optimize(2);
    const { firstLine, secondLine } = packer.makeDecoder();
    prodJs = firstLine + secondLine;

    console.log('html...');
    const minifiedHtml = minifyHTML(html, {
        collapseWhitespace: true,
        minifyCSS: false,
        minifyJS: false
    });

    console.log('css...');
    const minifiedCss = new CleanCSS().minify(css).styles;

    console.log('output...');
    const debugHtml = assembleHtml({ html, css, js: debugJs });
    const debugMangledHtml = assembleHtml({ html, css, js: debugMangledJs});
    const prodHtml = assembleHtml({ html: minifiedHtml, css: minifiedCss, js: prodJs, });

    console.log(prodJs.length);

    await fs.rm('build/', { force: true, recursive: true });
    await fs.mkdir('build/', { recursive: true });
    await fs.writeFile('build/debug.html', debugHtml);
    await fs.writeFile('build/debug_mangled.html', debugMangledHtml);
    await fs.writeFile('build/index.html', prodHtml);

    await makeZip({
        html: 'build/index.html',
        zip: 'build/game.zip',
    });
    await logFileSize('build/game.zip', 13 * 1024);

    await new Promise<void>((resolve, reject) => {
        // Guess I'm hardcoding this :p
        const subprocess = spawn('./Efficient-Compression-Tool/build/ect', [
            '-zip',
            'build/game.zip',
            '-9',
            '-strip',
        ]);

        subprocess.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject('ect failed with error code ' + code);
            }
        });
    });

    await logFileSize('build/game.zip', 13 * 1024);
})();

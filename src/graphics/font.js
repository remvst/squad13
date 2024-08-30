const CHARACTERS = {
    'A': [
        0b111,
        0b101,
        0b111,
        0b101,
        0b101,
    ],
    'I': [
        0b1,
        0b1,
        0b1,
        0b1,
    ],
    'L': [
        0b100,
        0b100,
        0b100,
        0b100,
        0b111,
    ],
    'O': [
        0b111,
        0b101,
        0b101,
        0b101,
        0b111,
    ],
    'X': [
        0b101,
        0b101,
        0b010,
        0b101,
        0b101,
    ],
    '+': [
        0b010,
        0b111,
        0b010,
    ],
    '-': [
        0b111,
    ],
    '=': [
        0b111,
        0b0,
        0b111,
    ],
    '.': [
        0b1,
    ],
    '[': [
        0b11,
        0b10,
        0b10,
        0b10,
        0b11,
    ]
}

const AVAILABLE_CHARACTERS = Object.keys(CHARACTERS);

function spriteForCharacterDefinition(characterDefinition, cellSize, color, blur) {
    if (!characterDefinition) return;

    const maxRowLength = max(...characterDefinition.map(line => line.toString(2).length));

    return createCanvas(maxRowLength * cellSize + blur * 2, characterDefinition.length * cellSize + blur * 2, ctx => {
        ctx.shadowBlur = blur;

        ctx.translate(blur, blur);

        let row = 0;
        for (const line of characterDefinition) {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            const lineStr = line.toString(2).padStart(maxRowLength, '0');
            for (let col = 0 ; col < 3 ; col++) {
                if (lineStr.charAt(col) === '1') {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
            row++;
        }
    })
}

const CACHE = new Map();
function characterSprite(char, cellSize, color, blur) {
    char = char.toUpperCase();

    const key = `${char}:${cellSize}:${color}:${blur}`;
    if (!CACHE.has(key)) {
        CACHE.set(key, spriteForCharacterDefinition(CHARACTERS[char], cellSize, color, blur));
    }
    return CACHE.get(key);
}

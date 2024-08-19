function colorStrToInt(color) {
    let colorHex = color.slice(1);
    if (colorHex.length === 3) {
        colorHex = `${colorHex.charAt(0)}0${colorHex.charAt(1)}0${colorHex.charAt(2)}0`;
    }

    return parseInt(colorHex, 16);
}

function rgbToStr(r, g, b) {
    return '#' + ((r << (8 * 2)) | (g << (8 * 1)) | (b << (8  * 0))).toString(16).padStart(6, '0');
}

function strToRgb(color) {
    const colorNum = colorStrToInt(color);
    return [
        (colorNum >> (8 * 2)) % 256,
        (colorNum >> (8 * 1)) % 256,
        (colorNum >> (8 * 0)) % 256,
    ];
}

function multiplyColor(color, factor) {
    let [r, g, b] = strToRgb(color);

    return rgbToStr(
        r * factor,
        g * factor,
        b * factor,
    );
}


function addColors(color1, color2) {
    let [r1, g1, b1] = strToRgb(color1);
    let [r2, g2, b2] = strToRgb(color2);

    return rgbToStr(
        r1 + r2,
        g1 + g2,
        b1 + b2,
    );
}

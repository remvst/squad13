createCanvasPattern = (patternWidth, patternHeight, instructions) => {
    const x = createCanvas(patternWidth, patternHeight, instructions);
    const patt = x.getContext('2d').createPattern(x, nomangle('repeat'));

    // Add some extra properties (background rendering needs to know the size of patterns)
    patt.width = patternWidth;
    patt.height = patternHeight;

    return patt;
};

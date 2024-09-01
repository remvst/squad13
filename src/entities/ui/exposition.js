class Exposition extends Entity {
    constructor(lines, skippable) {
        super();
        this.buckets.push('exposition');
        this.lines = lines;
        this.text = this.lines.join('\n');
        this.totalChars = this.lines.reduce((acc, line) => acc + line.length, 0);

        this.skippable = skippable;

        this.computedLinesCanvasWidth = 0;
    }

    get latestChar() {
        return this.text.charAt(this.visibleChars - 1);
    }

    get visibleChars() {
        return min(this.totalChars, ~~(this.age * 15));
    }

    complete() {
        return this.world.waitFor(() => this.visibleChars >= this.totalChars);
    }

    cycle(elapsed) {
        const { visibleChars } = this;

        if (this.skippable && (DOWN[32] || TOUCHES.length)) elapsed *= 8;

        super.cycle(elapsed);

        if (visibleChars < this.visibleChars && this.latestChar !== ' ' && this.latestChar !== '\n') {
            if (this.previousSound) {
                this.previousSound.stop();
            }
            this.previousSound = zzfx(...[.2,,634,,.01,.02,3,3.3,,,,,,.1,278,,,.95,.03,,518]); // Blip 687
            this.previousSound.start();
        }
    }

    calculateLines(availableWidth) {
        const newLines = [];

        ctx.font = nomangle('18pt Courier');

        for (const line of this.lines) {
            let currentLine = '';
            let currentLineWidth = 0;

            let i = 0;
            while (i < line.length) {
                let k = i;

                while (k < line.length && line.charAt(k) !== ' ') {
                    k++;
                }

                const addedWord = line.slice(i, k + 1);
                const addedWordWidth = ctx.measureText(addedWord).width;
                if (k > i) {
                    // const addedWord = line.slice(i, k + 1);

                    if (addedWordWidth + currentLineWidth < availableWidth) {
                        // The word fits, keep building the current line
                        currentLine += addedWord;
                        currentLineWidth += addedWordWidth;
                    } else {
                        // The word doesn't fit, add the current line and start a new one
                        newLines.push(currentLine);
                        currentLine = addedWord;
                        currentLineWidth = addedWordWidth;
                    }
                } else {
                    currentLine += addedWord;
                    currentLineWidth += addedWordWidth;
                }

                i = k + 1;
            }

            if (currentLine.length) {
                newLines.push(currentLine);
            }
        }

        return newLines;
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#000';
        ctx.shadowOffsetY = 2;
        ctx.font = nomangle('18pt Courier');
        ctx.textAlign = nomangle('left');
        ctx.textBaseline = nomangle('middle');

        if (this.computedLinesCanvasWidth !== CANVAS_WIDTH) {
            this.computedLinesCanvasWidth = CANVAS_WIDTH;
            this.computedLines = this.calculateLines(CANVAS_WIDTH - 100);
        }

        let y = CANVAS_HEIGHT / 2 - (this.computedLines.length * 25) / 2;

        let longestLine = 0;

        for (const line of this.computedLines) {
            longestLine = max(ctx.measureText(line).width, longestLine);
        }

        let charCount = 0;
        for (const line of this.computedLines) {
            ctx.fillText(line.slice(0, max(0, this.visibleChars - charCount)), (CANVAS_WIDTH - longestLine) / 2, y);
            y += 25;
            charCount += line.length;
        }

        if (this.skippable) {
            ctx.textAlign = nomangle('right');
            ctx.fillText(
                inputMode === INPUT_MODE_KEYBOARD
                    ? nomangle('Hold [SPACE] to fast forward')
                    : nomangle('Hold to fast forward'),
                CANVAS_WIDTH - 50,
                CANVAS_HEIGHT - 50,
            );
        }
    }
}

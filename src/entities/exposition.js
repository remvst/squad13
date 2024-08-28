class Exposition extends Entity {
    constructor(lines) {
        super();
        this.lines = lines;
        this.text = this.lines.join('\n');
        this.totalChars = this.lines.reduce((acc, line) => acc + line.length, 0);

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

        if (DOWN[32]) elapsed *= 4;

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

        console.log(this.lines);

        ctx.font = '18pt Courier';

        for (const line of this.lines) {
            let addedLine;
            let candidateStart = 0;
            for (let k = 0 ; k <= line.length ; k++) {
                if (k === line.length || line.charAt(k) === ' ') {
                    const candidate = line.slice(candidateStart, k);
                    const candidateWidth = ctx.measureText(candidate).width;

                    if (candidateWidth < availableWidth) {
                        addedLine = candidate;
                    } else {
                        if (addedLine) {
                            newLines.push(addedLine);
                        }
                        candidateStart = candidateStart + addedLine.length + 1;
                        addedLine = line.slice(candidateStart, k);
                    }
                }
            }

            if (candidateStart < line.length - 1) {
                newLines.push(line.slice(candidateStart));
            }
        }


        return newLines;
    }

    render(camera) {
        ctx.translate(~~camera.x - CANVAS_WIDTH / 2, ~~camera.y - CANVAS_HEIGHT / 2);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#000';
        ctx.shadowOffsetY = 2;
        ctx.font = nomangle('18pt Courier');
        ctx.textAlign = nomangle('left');
        ctx.textBaseline = nomangle('middle');

        let y = CANVAS_HEIGHT / 2 - (this.lines.length * 50) / 2;

        if (this.computedLinesCanvasWidth !== CANVAS_WIDTH) {
            this.computedLinesCanvasWidth = CANVAS_WIDTH;
            this.computedLines = this.calculateLines(CANVAS_WIDTH - 100);
        }

        let longestLine = 0;

        for (const line of this.computedLines) {
            longestLine = max(ctx.measureText(line).width, longestLine);
        }

        let charCount = 0;
        for (const line of this.computedLines) {
            ctx.fillText(line.slice(0, max(0, this.visibleChars - charCount)), (CANVAS_WIDTH - longestLine) / 2, y);
            y += 50;
            charCount += line.length;
        }

        ctx.textAlign = nomangle('right');
        ctx.fillText(nomangle('Hold [SPACE] to fast forward'), CANVAS_WIDTH - 50, CANVAS_HEIGHT - 50);
    }
}

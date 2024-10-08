// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

// This is a minified build of zzfx for use in size coding projects.
// You can use zzfxV to set volume.
// Feel free to minify it further for your own needs!

// 'use strict';

///////////////////////////////////////////////////////////////////////////////

// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name ZzFXMicro.min.js
// @js_externs zzfx, zzfxG, zzfxP, zzfxV, zzfxX
// @language_out ECMASCRIPT_2019
// ==/ClosureCompiler==

const zzfx = (...z)=> zzfxP(zzfxG(...z)); // generate and play sound
const zzfxV = .3;    // volume
const zzfxR = 44100; // sample rate
const zzfxX = new AudioContext; // audio context
const zzfxP = (...samples) =>  // play samples
{
    // create buffer and source
    let buffer = zzfxX.createBuffer(samples.length, samples[0].length, zzfxR),
        source = zzfxX.createBufferSource();

    // copy samples to buffer and play
    samples.map((d,i)=> buffer.getChannelData(i).set(d));
    source.buffer = buffer;
    source.connect(zzfxX.destination);
    return source;
}

class FunZZfx {
    constructor(...samples) {
        this.samples = samples;

        // create buffer and source
        let buffer = zzfxX.createBuffer(samples.length, samples[0].length, zzfxR);
        this.source = zzfxX.createBufferSource();

        // copy samples to buffer and play
        samples.map((d,i)=> buffer.getChannelData(i).set(d));
        this.source.buffer = buffer;

        this.gainNode = zzfxX.createGain();
        this.gainNode.connect(zzfxX.destination);

        this.source.connect(this.gainNode);
    }

    setRate(rate) {
        this.source.playbackRate.value = rate;
    }

    setVolume(volume) {
        this.gainNode.gain.value = volume;
    }

    start() {
        this.source.start();
    }

    stop() {
        this.source.stop();
    }
}


const zzfxG = // generate samples
(
    // parameters
    volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0,
    release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
    pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0,
    bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0
)=>
{
    // init parameters
    let PI2 = PI*2,
    sign = v => v>0?1:-1,
    startSlide = slide *= 500 * PI2 / zzfxR / zzfxR,
    startFrequency = frequency *= (1 + randomness*2*random() - randomness)
        * PI2 / zzfxR,
    b=[], t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;

    // scale by sample rate
    attack = attack * zzfxR + 9; // minimum attack to prevent pop
    decay *= zzfxR;
    sustain *= zzfxR;
    release *= zzfxR;
    delay *= zzfxR;
    deltaSlide *= 500 * PI2 / zzfxR**3;
    modulation *= PI2 / zzfxR;
    pitchJump *= PI2 / zzfxR;
    pitchJumpTime *= zzfxR;
    repeatTime = repeatTime * zzfxR | 0;

    // generate waveform
    for(length = attack + decay + sustain + release + delay | 0;
        i < length; b[i++] = s)
    {
        if (!(++c%(bitCrush*100|0)))                      // bit crush
        {
            s = shape? shape>1? shape>2? shape>3?         // wave shape
                sin((t%PI2)**3) :                    // 4 noise
                max(min(tan(t),1),-1):     // 3 tan
                1-(2*t/PI2%2+2)%2:                        // 2 saw
                1-4*abs(round(t/PI2)-t/PI2):    // 1 triangle
                sin(t);                              // 0 sin

            s = (repeatTime ?
                    1 - tremolo + tremolo*sin(PI2*i/repeatTime) // tremolo
                    : 1) *
                sign(s)*(abs(s)**shapeCurve) *       // curve 0=square, 2=pointy
                volume * zzfxV * (                        // envelope
                i < attack ? i/attack :                   // attack
                i < attack + decay ?                      // decay
                1-((i-attack)/decay)*(1-sustainVolume) :  // decay falloff
                i < attack  + decay + sustain ?           // sustain
                sustainVolume :                           // sustain volume
                i < length - delay ?                      // release
                (length - i - delay)/release *            // release falloff
                sustainVolume :                           // release volume
                0);                                       // post release

            s = delay ? s/2 + (delay > i ? 0 :            // delay
                (i<length-delay? 1 : (length-i)/delay) *  // release delay
                b[i-delay|0]/2) : s;                      // sample delay
        }

        f = (frequency += slide += deltaSlide) *          // frequency
            cos(modulation*tm++);                    // modulation
        t += f - f*noise*(1 - (sin(i)+1)*1e9%2);     // noise

        if (j && ++j > pitchJumpTime)       // pitch jump
        {
            frequency += pitchJump;         // apply pitch jump
            startFrequency += pitchJump;    // also apply to start
            j = 0;                          // reset pitch jump time
        }

        if (repeatTime && !(++r % repeatTime)) // repeat
        {
            frequency = startFrequency;     // reset frequency
            slide = startSlide;             // reset slide
            j = j || 1;                     // reset pitch jump time
        }
    }

    return b;
}

sound = (...def) => new FunZZfx(zzfxG(...def)).start();

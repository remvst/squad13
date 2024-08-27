let DOWN = {};
onkeydown = e => {
    // if (e.keyCode == 27 || e.keyCode == 80) {
    //     GAME_PAUSED = !GAME_PAUSED;
    //     setSongVolume(GAME_PAUSED ? 0 : SONG_VOLUME);
    // }

    // Toggle easy mode
    if (e.keyCode === 75) {
        G.easyMode = !G.easyMode;
        sound(...[2,,409,,.02,.02,1,.5,-2,,-316,.05,,,137,,.43,.82,.02]); // Blip 189
    }

    DOWN[e.keyCode] = true
};
onkeyup = e => DOWN[e.keyCode] = false;

// Reset inputs when window loses focus
onblur = onfocus = () => {
    DOWN = {};
    MOUSE_RIGHT_DOWN = MOUSE_DOWN = false;
};

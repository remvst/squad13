let TOUCHES = [];

updateTouches = (event) => {
    inputMode = INPUT_MODE_TOUCH;

    TOUCHES = [];

    event.preventDefault();
    event.stopPropagation();

    for (const touch of event.touches) {
        TOUCHES.push({});
        getEventPosition(touch, can, TOUCHES[TOUCHES.length - 1]);
    }
};

ontouchstart = updateTouches;
ontouchmove = updateTouches;
ontouchend = updateTouches;

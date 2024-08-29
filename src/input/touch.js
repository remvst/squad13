let TOUCHES = [];

updateTouches = (touches) => {
    TOUCHES = [];

    for (const touch of touches) {
        TOUCHES.push({});
        getEventPosition(touch, can, TOUCHES[TOUCHES.length - 1]);
    }
};

document.addEventListener('touchstart', {}); // iOS Safari touches fix in iframes

ontouchstart = (event) => {
    inputMode = INPUT_MODE_TOUCH;
    event.preventDefault();
    updateTouches(event.touches);
};

ontouchmove = (event) => {
    event.preventDefault();
    updateTouches(event.touches);
};

ontouchend = (event) => {
    event.preventDefault();
    updateTouches(event.touches);
};

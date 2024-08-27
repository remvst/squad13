let DOWN = {};
onkeydown = e => DOWN[e.keyCode] = true;
onkeyup = e => DOWN[e.keyCode] = false;

// Reset inputs when window loses focus
onblur = onfocus = () => {
    DOWN = {};
    MOUSE_RIGHT_DOWN = MOUSE_DOWN = false;
};

let MOUSE = {x: 0, y: 0, down: 0};
onmousemove = e => {
    const rect = can.getBoundingClientRect();

    MOUSE.x = (e.clientX - rect.left) / rect.width * CANVAS_WIDTH;
    MOUSE.y = (e.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
};

onmousedown = e => {
    MOUSE.down = true;
};

onmouseup = e => {
    MOUSE.down = false;
};

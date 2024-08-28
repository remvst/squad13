let MOUSE = {x: 0, y: 0, down: 0};
onmousemove = event => {
    getEventPosition(event, can, MOUSE);
};

onmousedown = e => {
    MOUSE.down = true;
};

onmouseup = e => {
    MOUSE.down = false;
};

oncontextmenu = (event) => event.preventDefault();

getEventPosition = (event, can, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (event.pageX - canvasRect.left) / canvasRect.width * can.width;
    out.y = (event.pageY - canvasRect.top) / canvasRect.height * can.height;
}

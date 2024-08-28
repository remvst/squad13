onload = () => {
    can = document.querySelector('canvas');
    can.width = CANVAS_WIDTH;
    can.height = CANVAS_HEIGHT;

    ctx = can.getContext('2d');

    onresize();

    G = new Game();

    frame();
}

frame = () => {
    const current = performance.now();
    const elapsed = (current - lastFrame) / 1000;
    lastFrame = current;

    G.cycle(elapsed);

    requestAnimationFrame(frame);
}

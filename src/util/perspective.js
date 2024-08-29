applyPerspective = (camera, point, z, out) => {
    const relDistX = (point.x - camera.x) / (CANVAS_WIDTH / 2);
    const relDistY = (point.y - camera.y) / (CANVAS_HEIGHT / 2);

    const addX = z * relDistX * PERSPECTIVE;
    const addY = z * relDistY * PERSPECTIVE;

    out.x = point.x + addX;
    out.y = point.y + addY;
};

PERSPECTIVE_OUT1 = {};
PERSPECTIVE_OUT2 = {};

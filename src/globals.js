let can,
    ctx,
    G,
    lastFrame = 0,
    w = window,
    canvasPrototype = CanvasRenderingContext2D.prototype,
    CANVAS_WIDTH = 1600,
    CANVAS_HEIGHT = 900;

inputMode = navigator.userAgent.match(nomangle(/andro|ipho|ipa|ipo/i)) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    ? INPUT_MODE_TOUCH
    : INPUT_MODE_KEYBOARD;

MONTHS = [
    // You didn't think I would include all the months, did you? Bytes are expensive!
    nomangle('January'),
    nomangle('March'),
    nomangle('April'),
    nomangle('May'),
    nomangle('June'),
    nomangle('August'),
    nomangle('September'),
    nomangle('October'),
];
COUNTRIES = [
    nomangle('Warkistan'),
    nomangle('Murdavia'),
    nomangle('Kingdom of Zarathar'),
    nomangle('Khaldonia'),
    nomangle('Republic of Eldrania'),
    nomangle('Wabanka'),
    nomangle('Simian Islands'),
    nomangle('Serkhan Territories'),
    nomangle('Vashir Confederacy'),
    nomangle('Drazara Islands'),
];

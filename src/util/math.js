between = (a, b, c) => b < a ? a : (b > c ? c : b);
isBetween = (a, b, c) => a <= b && b <= c || a >= b && b >= c;
rnd = (min, max) => random() * (max - min) + min;
distP = (x1, y1, x2, y2) => hypot(x1 - x2, y1 - y2);
dist = (a, b) => distP(a.x, a.y, b.x, b.y);
normalize = x => moduloWithNegative(x, PI);
angleBetween = (a, b) => atan2(b.y - a.y, b.x - a.x);
roundToNearest = (x, precision) => round(x / precision) * precision;
pick = a => a[~~(random() * a.length)];

// Easing
linear = x => x;
easeOutQuint = x => 1 - pow(1 - x, 5);
easeOutBack = (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
interpolate = (from, to, ratio, easing = linear) => {
    return easing(between(0, ratio, 1)) * (to - from) + from;
}

// Modulo centered around zero: the result will be between -y and +y
moduloWithNegative = (x, y) => {
    x = x % (y * 2);
    if (x > y) {
        x -= y * 2;
    }
    if (x < -y) {
        x += y * 2;
    }
    return x;
};

// Make Math global
Object.getOwnPropertyNames(Math).forEach(n => w[n] = w[n] || Math[n]);

TWO_PI = PI * 2;

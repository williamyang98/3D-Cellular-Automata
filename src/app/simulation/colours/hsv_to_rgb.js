let hsv_to_rgb = (h, s, v) => {
    const HUE_MAX = 360;
    const SAT_MAX = 100;
    const VAL_MAX = 100;
    const RGB_MAX = 255;

    h = (h === HUE_MAX) ? 1 : (h % HUE_MAX / HUE_MAX * 6);
    s = (s === SAT_MAX) ? 1 : (s % SAT_MAX / SAT_MAX);
    v = (v === VAL_MAX) ? 1 : (v % VAL_MAX / VAL_MAX);

    let i = Math.floor(h)
    let f = h - i
    let p = v * (1 - s)
    let q = v * (1 - f * s)
    let t = v * (1 - (1 - f) * s)
    let mod = i % 6
    let r = [v, q, p, p, t, v][mod]
    let g = [t, v, v, q, p, p][mod]
    let b = [p, p, t, v, v, q][mod]

    return {
        r: Math.floor(r * RGB_MAX),
        g: Math.floor(g * RGB_MAX),
        b: Math.floor(b * RGB_MAX),
    }
}

export { hsv_to_rgb };
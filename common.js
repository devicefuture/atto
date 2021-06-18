import * as canvas from "./canvas.js";

function hueToRgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }

    if (t > 1) {
        t -= 1;
    }

    if (t <= 1 / 6) {
        return p + ((q - p) * 6 * t);
    }

    if (t <= 1 / 2) {
        return q;
    }

    if (t < 2 / 3) {
        return p + ((q - p) * ((2 / 3) - t) * 6);
    }

    return p;
}

export function colourFromHsl(hue, saturation, luminance, alpha = 1) {
    var colour = new canvas.Colour(0, 0, 0, alpha);

    if (saturation == 0) {
        colour.red = colour.green = colour.blue = luminance;
    } else {
        var q = luminance < (1 / 2) ? luminance * (1 + saturation) : luminance + saturation - (luminance * saturation);
        var p = 2 * luminance - q;

        colour.red = hueToRgb(p, q, hue + (1 / 3));
        colour.green = hueToRgb(p, q, hue);
        colour.blue = hueToRgb(p, q, hue - (1 / 3));
    }

    colour.red = Math.round(colour.red * 255);
    colour.green = Math.round(colour.green * 255);
    colour.blue = Math.round(colour.blue * 255);

    return colour;
}
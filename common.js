import * as canvas from "./canvas.js";
import * as basic from "./basic.js";

export * from "./core.js";

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

export function colourFromHsl(hue, saturation, luminance, alpha = 1, trigMode = basic.trigMode) {
    var colour = new canvas.Colour(0, 0, 0, alpha);

    hue = basic.trigModeToRadians(hue, trigMode) / (2 * Math.PI);

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

export function hslFromColour(colour, trigMode = basic.trigMode) {
    colour = colour.clone();

    colour.red /= 255;
    colour.green /= 255;
    colour.blue /= 255;

    var max = Math.max(colour.red, colour.green, colour.blue);
    var min = Math.min(colour.red, colour.green, colour.blue);

    var hue, saturation, luminance = (max + min) / 2;

    if (max == min) {
        hue = saturation = 0;
    } else {
        var range = max - min;

        saturation = luminance > 0.5 ? range / (2 - max - min) : range / (max + min);

        switch (max) {
            case colour.red:
                hue = ((colour.green - colour.blue) / range) + (colour.green < colour.blue ? 6 : 0);
                break;

            case colour.green:
                hue = ((colour.blue - colour.red) / range) + 2;
                break;

            case colour.blue:
                hue = ((colour.red - colour.green) / range) + 4;
                break;
        }

        hue /= 6;
    }

    hue = basic.radiansToTrigMode(hue * (2 * Math.PI), trigMode);

    return {hue, saturation, luminance, alpha: colour.alpha};
}
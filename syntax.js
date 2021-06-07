import * as canvas from "./canvas.js";
import * as term from "./term.js";

const RE_STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/i;
const RE_LINE_NUMBER = /^\d+/i;
const RE_KEYWORD = /(?<![a-z])(?:print|input|goto|if|then|else|end|for|to|step|next)(?![a-z])/i;

const RE_OR = /|/;

const RE_ALL = new RegExp([
    RE_STRING_LITERAL.source,
    RE_LINE_NUMBER.source,
    RE_KEYWORD.source
].join(RE_OR.source), "gi");

const KEYWORD_COLOURS = {
    "print": {background: "purple", foreground: "white"},
    "input": {background: "purple", foreground: "white"},
    "goto": {background: "blue", foreground: "white"},
    "if": {background: "blue", foreground: "white"},
    "else": {background: "blue", foreground: "white"},
    "then": {background: "blue", foreground: "white"},
    "end": {background: "blue", foreground: "white"},
    "for": {background: "blue", foreground: "white"},
    "to": {background: "blue", foreground: "white"},
    "step": {background: "blue", foreground: "white"},
    "next": {background: "blue", foreground: "white"}
};

function renderBackgroundHighlight(length, col, row) {
    canvas.fillRoundedRect(
        (col * canvas.CHAR_WIDTH) + 1,
        row * canvas.CHAR_HEIGHT,
        (col + length) * canvas.CHAR_WIDTH,
        ((row + 1) * canvas.CHAR_HEIGHT) - 2,
        4
    );
}

function setColourByName(name) {
    return canvas.setColour(canvas.colourScheme[canvas.COLOUR_NAMES[name]]);
}

export class Token {
    constructor(code, lineNumber = null) {
        this.code = code;
        this.lineNumber = lineNumber;
    }
}

export class ExecutionLabel extends Token {}
export class Keyword extends Token {}

export function highlight(code, index, col, row) {
    var defaultBackground = term.backgroundColour;
    var defaultForeground = term.foregroundColour;
    var match;

    function clean() {
        term.setColours(defaultBackground, defaultForeground);
    }

    term.setColours(new canvas.Colour(0, 0, 0, 0), defaultForeground);

    term.goto(col, row);
    term.print(code[index], false, false);

    while (match = RE_ALL.exec(code)) {
        var start = match.index;
        var length = match[0].length;

        if (index < start || index >= start + length) {
            continue;
        }

        term.setColours(new canvas.Colour(0, 0, 0, 0), defaultForeground);

        if (RE_STRING_LITERAL.exec(match)) {
            clean();
            term.foreground("green");
        } else if (RE_KEYWORD.exec(match)) {
            var keyword = match.toString().toLocaleLowerCase();

            if (Object.keys(KEYWORD_COLOURS).includes(keyword)) {
                if (index == start) {
                    setColourByName(KEYWORD_COLOURS[keyword].background);
                    renderBackgroundHighlight(length, col, row);
                }
    
                term.foreground(KEYWORD_COLOURS[keyword].foreground);
            }
        }

        term.goto(col, row);
        term.print(code[index], false, false);
    }

    clean();
}

export function tokeniseLine(code, lineNumber = null) {
    var tokens = [];
    var lineSymbols = [];
    var match;

    while (match = RE_ALL.exec(code)) {
        lineSymbols.push(match[0]);
    }

    for (var i = 0; i < lineSymbols.length; i++) {
        if (RE_LINE_NUMBER.exec(lineSymbols[i]) && i == 0) {
            tokens.push(new ExecutionLabel(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_KEYWORD.exec(lineSymbols[i])) {
            tokens.push(new Keyword(lineSymbols[i], lineNumber));
        }
    }
}

export function tokenise(program) {
    var tokens = [];

    for (var i = 0; i < program.length; i++) {
        if (typeof(program[i]) != "string") {
            continue;
        }

        tokens = tokens.concat(tokeniseLine(program[i], i));
    }
}
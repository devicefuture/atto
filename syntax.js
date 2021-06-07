import * as canvas from "./canvas.js";
import * as term from "./term.js";

const RE_STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/i;
const RE_LINE_NUMBER = /^\d+/i;
const RE_NUMERIC_LITERAL_HEX = /\b0(?:x|X)[0-9a-fA-F]+\b/;
const RE_NUMERIC_LITERAL_BIN = /\b0(?:b|B)[01]+\b/;
const RE_NUMERIC_LITERAL_OCT = /\b0(?:o|O)[0-7]+\b/;
const RE_NUMERIC_LITERAL_SCI = /(?<![\w\.])(?:[0-9]+\.?[0-9]*|[0-9]*\.?[0-9]+)(?:[eE][+-]?[0-9]+)?(?![\w\.])/;
const RE_KEYWORD = /(?<![a-z])(?<![a-z][0-9]+)(?:print|input|goto|if|then|else|end|for|to|step|next)(?![a-z])/i;
const RE_IDENTIFIER = /[a-z][a-z0-9]+[$%!]?/i;
const RE_OPERATOR = /\+|-|\*|\/|\^|(?<![a-z])(?:mod|and|or|xor)(?![a-z])/i;
const RE_WHTIESPACE = /\w+/;;

const RE_OR = /|/;

const RE_ALL = new RegExp([
    RE_STRING_LITERAL.source,
    RE_LINE_NUMBER.source,
    RE_NUMERIC_LITERAL_HEX.source,
    RE_NUMERIC_LITERAL_BIN.source,
    RE_NUMERIC_LITERAL_OCT.source,
    RE_NUMERIC_LITERAL_SCI.source,
    RE_KEYWORD.source,
    RE_IDENTIFIER.source,
    RE_OPERATOR.source,
    RE_WHTIESPACE.source
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

        this.children = [];
    }
}

export class StatementEnd extends Token {}
export class ExecutionLabel extends Token {}
export class NumericLiteral extends Token {}
export class Keyword extends Token {}
export class Identifier extends Token {}
export class Operator extends Token {}

export class Expression extends Token {
    constructor(tokens, operator = null, childExpressionClass = null, lineNumber = null) {
        super("", lineNumber);

        this.tokens = tokens;
        this.operator = operator;
        this.childExpressionClass = childExpressionClass;
    }

    parse() {
        if (this.operator == null) {
            return; // This is a leaf expression
        }

        this.children = [new this.childExpressionClass([], this.lineNumber)];

        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] instanceof Operator && this.tokens[i].code == this.operator.code) {
                this.children.push(new this.childExpressionClass([], this.lineNumber));
            } else {
                this.children[this.children.length - 1].tokens.push(this.tokens[i]);
            }
        }

        this.children.forEach((i) => i.parse());
    }
}

export class SubtractionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("-"), AdditionExpression, lineNumber);
    }
}

export class AdditionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("+"), MultiplicationExpression, lineNumber);
    }
}

export class MultiplicationExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("*"), DivisionExpression, lineNumber);
    }
}

export class DivisionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("/"), ExponentiationExpression, lineNumber);
    }
}

export class ExponentiationExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("^"), ModuloExpression, lineNumber);
    }
}

export class ModuloExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("mod"), LogicalAndExpression, lineNumber);
    }
}

export class LogicalAndExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("and"), LogicalOrExpression, lineNumber);
    }
}

export class LogicalOrExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("or"), LogicalXorExpression, lineNumber);
    }
}

export class LogicalXorExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("xor"), LeafExpression, lineNumber);
    }
}

export class LeafExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, null, null, lineNumber);
    }
}

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
    var expressionTokens = [];
    var match;

    while (match = RE_ALL.exec(code)) {
        lineSymbols.push(match[0]);
    }

    function computeExpressionTokens() {
        if (expressionTokens.length == 0) {
            return;
        }

        tokens.push(new AdditionExpression(expressionTokens, lineNumber));
        tokens[tokens.length - 1].parse();

        expressionTokens = [];
    }

    for (var i = 0; i < lineSymbols.length; i++) {
        if (RE_LINE_NUMBER.exec(lineSymbols[i]) && i == 0) {
            computeExpressionTokens();
            tokens.push(new ExecutionLabel(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_KEYWORD.exec(lineSymbols[i])) {
            computeExpressionTokens();
            tokens.push(new Keyword(lineSymbols[i], lineNumber));

            continue;
        }

        if (
            RE_NUMERIC_LITERAL_HEX.exec(lineSymbols[i]) ||
            RE_NUMERIC_LITERAL_BIN.exec(lineSymbols[i]) ||
            RE_NUMERIC_LITERAL_OCT.exec(lineSymbols[i]) ||
            RE_NUMERIC_LITERAL_SCI.exec(lineSymbols[i])
        ) {
            expressionTokens.push(new NumericLiteral(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_IDENTIFIER.exec(lineSymbols[i])) {
            expressionTokens.push(new Identifier(lineSymbols[i], lineNumber));

            continue;
        }
    
        if (RE_OPERATOR.exec(lineSymbols[i])) {
            expressionTokens.push(new Operator(lineSymbols[i], lineNumber));

            continue;
        }
    }

    computeExpressionTokens();

    return tokens;
}

export function tokenise(program) {
    var tokens = [];

    for (var i = 0; i < program.length; i++) {
        if (typeof(program[i]) != "string") {
            continue;
        }

        tokens = tokens.concat(tokeniseLine(program[i], i));

        tokens.push(new StatementEnd("", i));
    }
}
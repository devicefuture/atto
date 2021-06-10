import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as basic from "./basic.js";

const RE_STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/i;
const RE_LINE_NUMBER = /^\d+/i;
const RE_NUMERIC_LITERAL_HEX = /(?<![a-z])0(?:x|X)[0-9a-fA-F]+/;
const RE_NUMERIC_LITERAL_BIN = /(?<![a-z])0(?:b|B)[01]+/;
const RE_NUMERIC_LITERAL_OCT = /(?<![a-z])0(?:o|O)[0-7]+/;
const RE_NUMERIC_LITERAL_SCI = /(?:(?<=mod|and|or|xor)|(?<![a-z.]))(?:[0-9]+\.?[0-9]*|[0-9]*\.?[0-9]+)(?:[eE][+-]?[0-9]+)?(?!\.)/;
const RE_KEYWORD = /(?<![a-z])(?<![a-z][0-9]+)(?:print|input|goto|if|else|end|for|to|step|next)/i;
const RE_FUNCTION_NAME = /(?<![a-z])(?<![a-z][0-9]+)(?:sin|cos|tan|asin|acos|atan|log|ln)/i;
const RE_OPERATOR = /\+|-|\*|\/|\^|(?<![a-z])(?:mod|and|or|xor)(?![a-z])/i;
const RE_COMPARATOR = /!=|<=|>=|=|<|>/i;
const RE_IDENTIFIER = /[a-z][a-z0-9]*[$%]?/i;
const RE_EXPRESSION_BRACKET = /[()]/;
const RE_STRING_CONCAT = /;/;
const RE_PARAMETER_SEPERATOR = /,/;
const RE_STATEMENT_SEPERATOR = /:/;
const RE_WHTIESPACE = /\w+/;

const RE_OR = /|/;

const RE_ALL = new RegExp([
    RE_STRING_LITERAL.source,
    RE_LINE_NUMBER.source,
    RE_NUMERIC_LITERAL_HEX.source,
    RE_NUMERIC_LITERAL_BIN.source,
    RE_NUMERIC_LITERAL_OCT.source,
    RE_NUMERIC_LITERAL_SCI.source,
    RE_KEYWORD.source,
    RE_FUNCTION_NAME.source,
    RE_OPERATOR.source,
    RE_COMPARATOR.source,
    RE_IDENTIFIER.source,
    RE_EXPRESSION_BRACKET.source,
    RE_STRING_CONCAT.source,
    RE_PARAMETER_SEPERATOR.source,
    RE_STATEMENT_SEPERATOR.source,
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

const ESCAPE_CHARS = {
    "'": "'",
    "\"": "\"",
    "`": "`",
    "\\": "\\",
    "n": "\n",
    "r": "\r",
    "t": "\t",
    "v": "\v",
    "b": "\b",
    "f": "\f"
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

    parse() {}
}

export class ParameterSeperator extends Token {}
export class StatementEnd extends Token {}
export class ExecutionLabel extends Token {}
export class Keyword extends Token {}
export class Operator extends Token {}
export class Comparator extends Token {}
export class StringConcat extends Token {}

export class ExpressionBracket extends Token {
    isOpening() {
        return this.code == "(";
    }
}

export class Value extends Token {
    get value() {
        return null;
    }
}

export class StringLiteral extends Value {
    get value() {
        var value = "";
        var inEscape = false;

        for (var i = 0; i < this.code.length; i++) {
            if (i == 0 || i == this.code.length - 1) {
                continue;
            } else if (inEscape && ESCAPE_CHARS.hasOwnProperty(this.code[i])) {
                value += ESCAPE_CHARS[this.code[i]];
                inEscape = false;
            } else if (this.code[i] == "\\") {
                inEscape = true;
            } else {
                value += this.code[i];
            }
        }

        return value;
    }
}

export class NumericLiteral extends Value {
    get value() {
        if (RE_NUMERIC_LITERAL_HEX.exec(this.code)) {
            return parseInt(this.code.substring(2), 16);
        }

        if (RE_NUMERIC_LITERAL_BIN.exec(this.code)) {
            return parseInt(this.code.substring(2), 2);
        }

        if (RE_NUMERIC_LITERAL_OCT.exec(this.code)) {
            return parseInt(this.code.substring(2), 8);
        }

        if (RE_NUMERIC_LITERAL_SCI.exec(this.code)) {
            return this.valueSci;
        }
    }

    get valueSci() {
        var value = "";
        var exponent = "";
        var inExponent = false;
        var negativeExponent = false;

        for (var i = 0; i < this.code.length; i++) {
            if (this.code[i] == "e" || this.code[i] == "E") {
                inExponent = true;
            } else if (this.code[i] == "-") {
                negativeExponent = true;
            } else if (inExponent) {
                if (this.code[i] == "+") {continue;}

                exponent += this.code[i];
            } else {
                value += this.code[i];
            }
        }

        return (Number(value) || 0) * Math.pow(10, (negativeExponent ? -1 : 1) * (Number(exponent) || 0));
    }
}

export class Identifier extends Value {
    get value() {
        return basic.getVariable(this.code);
    }
}

export class Expression extends Token {
    constructor(tokens, operator = null, childExpressionClass = null, lineNumber = null) {
        super(null, lineNumber);

        this.tokens = tokens;
        this.operator = operator;
        this.childExpressionClass = childExpressionClass;
    }

    parse() {
        if (this.operator == null) {
            this.children = this.tokens;

            this.children.forEach((i) => i.parse());

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

    getPrimaryIdentifier() {
        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] instanceof Identifier) {
                return this.tokens[i];
            }
        }

        return null;
    }

    get value() {
        var value = this.children[0].value;

        for (var i = 1; i < this.children.length; i++) {
            value = this.reduce(value, this.children[i].value);
        }

        return value;
    }
}

export class Function extends Token {
    constructor(code, lineNumber = null, expression = null) {
        super(code, lineNumber);

        this.expression = expression;
    }

    parse() {
        this.expression.parse();
    }

    get value() {
        switch (this.code.toLocaleLowerCase()) {
            case "sin": return Math.sin(basic.trigModeToRadians(this.expression.value));
            case "cos": return Math.cos(basic.trigModeToRadians(this.expression.value));
            case "tan": return Math.tan(basic.trigModeToRadians(this.expression.value));
            case "asin": return basic.radiansToTrigMode(Math.asin(this.expression.value));
            case "acos": return basic.radiansToTrigMode(Math.acos(this.expression.value));
            case "atan": return basic.radiansToTrigMode(Math.atan(this.expression.value));
            case "log": return Math.log10(this.expression.value);
            case "ln": return Math.log(this.expression.value);
        }
    }
}

export class SubtractionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("-"), AdditionExpression, lineNumber);
    }

    parse() {
        this.children = [new this.childExpressionClass([], this.lineNumber)];

        var bracketLevel = 0;
        var bracketTokens = [];
        var chosenFunction = null;

        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] instanceof Function) {
                chosenFunction = this.tokens[i];

                continue;
            }

            if (this.tokens[i] instanceof ExpressionBracket && this.tokens[i].isOpening()) {
                bracketLevel++;

                continue;
            }

            if (this.tokens[i] instanceof ExpressionBracket) {
                bracketLevel--;

                if (bracketLevel == 0) {
                    var expression = new this.constructor(bracketTokens, this.lineNumber);

                    if (chosenFunction != null) {
                        chosenFunction.expression = expression;

                        this.children[this.children.length - 1].tokens.push(chosenFunction);
                    } else {
                        this.children[this.children.length - 1].tokens.push(expression);
                    }

                    chosenFunction = null;
                    bracketTokens = [];
                }

                continue;
            }

            if (bracketLevel > 0) {
                bracketTokens.push(this.tokens[i]);

                continue;
            }

            if (chosenFunction != null) {
                throw new basic.ParsingSyntaxError("Expected value after function name");
            }

            if (this.tokens[i] instanceof Operator && this.tokens[i].code == this.operator.code) {
                this.children.push(new this.childExpressionClass([], this.lineNumber));
            } else {
                this.children[this.children.length - 1].tokens.push(this.tokens[i]);
            }
        }

        this.children.forEach((i) => i.parse());
    }

    reduce(a, b) {
        return a - b;
    }
}

export class AdditionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("+"), MultiplicationExpression, lineNumber);
    }

    reduce(a, b) {
        return a + b;
    }
}

export class MultiplicationExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("*"), DivisionExpression, lineNumber);
    }

    reduce(a, b) {
        return a * b;
    }
}

export class DivisionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("/"), ExponentiationExpression, lineNumber);
    }

    reduce(a, b) {
        return a / b;
    }
}

export class ExponentiationExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("^"), ModuloExpression, lineNumber);
    }

    reduce(a, b) {
        return Math.pow(a, b);
    }
}

export class ModuloExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("mod"), LogicalAndExpression, lineNumber);
    }

    reduce(a, b) {
        return a % b;
    }
}

export class LogicalAndExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("and"), LogicalOrExpression, lineNumber);
    }

    reduce(a, b) {
        return a & b;
    }
}

export class LogicalOrExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("or"), LogicalXorExpression, lineNumber);
    }

    reduce(a, b) {
        return a | b;
    }
}

export class LogicalXorExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("xor"), LeafExpression, lineNumber);
    }

    reduce(a, b) {
        return a ^ b;
    }
}

export class LeafExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, null, null, lineNumber);
    }

    get value() {
        return this.tokens[0].value;
    }
}

export function highlight(code, index, col, row) {
    var defaultBackground = term.backgroundColour;
    var defaultForeground = term.foregroundColour;
    var match;

    function useForeground(name, alpha = 1) {
        var foregroundColour = canvas.colourScheme[canvas.COLOUR_NAMES[name]].clone();

        foregroundColour.alpha = alpha;

        if (!foregroundColour.matches(defaultBackground)) {
            term.setColours(defaultBackground, foregroundColour);
        } else {
            term.setColours(defaultBackground, canvas.colourScheme[canvas.COLOUR_NAMES.black]);
        }
    }

    term.setColours(new canvas.Colour(0, 0, 0, 0), defaultForeground);

    term.goto(col, row);
    term.print(code[index], false, false);

    var bracketLevel = 0;

    while (match = RE_ALL.exec(code)) {
        var start = match.index;
        var length = match[0].length;

        if (index < start || index >= start + length) {
            if (match == "(") {
                bracketLevel++;
            }
    
            if (match == ")") {
                bracketLevel--;
            }

            continue;
        }

        term.setColours(new canvas.Colour(0, 0, 0, 0), defaultForeground);

        if (RE_STRING_LITERAL.exec(match)) {
            useForeground("green");
        } else if (RE_KEYWORD.exec(match)) {
            var keyword = match.toString().toLocaleLowerCase();

            if (Object.keys(KEYWORD_COLOURS).includes(keyword)) {
                if (index == start) {
                    setColourByName(KEYWORD_COLOURS[keyword].background);
                    renderBackgroundHighlight(length, col, row);
                }
    
                term.foreground(KEYWORD_COLOURS[keyword].foreground);
            }
        } else if (
            RE_NUMERIC_LITERAL_HEX.exec(match) ||
            RE_NUMERIC_LITERAL_BIN.exec(match) ||
            RE_NUMERIC_LITERAL_OCT.exec(match) ||
            RE_NUMERIC_LITERAL_SCI.exec(match)
        ) {
            useForeground("black");
        } else if (RE_FUNCTION_NAME.exec(match)) {
            if (index == start) {
                setColourByName("magenta");
                renderBackgroundHighlight(length, col, row);
            }

            term.foreground("white");
        } else if (RE_EXPRESSION_BRACKET.exec(match)) {
            if (match == "(") {
                bracketLevel++;
            }

            if (bracketLevel > 0) {
                useForeground("black", 1 - (Math.min(bracketLevel, 3) * 0.3));
            } else {
                useForeground("red");
            }

            if (match == ")") {
                bracketLevel--;
            }
        } else if (RE_OPERATOR.exec(match)) {
            useForeground("magenta");
        } else if (RE_STRING_CONCAT.exec(match)) {
            useForeground("purple");
        } else if (RE_STATEMENT_SEPERATOR.exec(match)) {
            useForeground("blue");
        }

        term.goto(col, row);
        term.print(code[index], false, false);
    }

    term.setColours(defaultBackground, defaultForeground);
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

        tokens.push(new SubtractionExpression(expressionTokens, lineNumber));
        tokens[tokens.length - 1].parse();

        expressionTokens = [];
    }

    for (var i = 0; i < lineSymbols.length; i++) {
        if (RE_LINE_NUMBER.exec(lineSymbols[i]) && i == 0) {
            computeExpressionTokens();
            tokens.push(new ExecutionLabel(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_STRING_LITERAL.exec(lineSymbols[i])) {
            expressionTokens.push(new StringLiteral(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_KEYWORD.exec(lineSymbols[i])) {
            computeExpressionTokens();
            tokens.push(new Keyword(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_STRING_CONCAT.exec(lineSymbols[i])) {
            computeExpressionTokens();
            expressionTokens.push(new StringConcat(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_STATEMENT_SEPERATOR.exec(lineSymbols[i])) {
            computeExpressionTokens();
            tokens.push(new StatementEnd(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_PARAMETER_SEPERATOR.exec(lineSymbols[i])) {
            computeExpressionTokens();
            tokens.push(new ParameterSeperator(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_COMPARATOR.exec(lineSymbols[i])) {
            computeExpressionTokens();
            tokens.push(new Comparator(lineSymbols[i], lineNumber));

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

        if (RE_FUNCTION_NAME.exec(lineSymbols[i])) {
            expressionTokens.push(new Function(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_IDENTIFIER.exec(lineSymbols[i])) {
            expressionTokens.push(new Identifier(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_EXPRESSION_BRACKET.exec(lineSymbols[i])) {
            expressionTokens.push(new ExpressionBracket(lineSymbols[i], lineNumber));

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

    return tokens;
}
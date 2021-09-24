import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as basic from "./basic.js";

const RE_STRING_LITERAL = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/i;
const RE_LINE_NUMBER = /^\d{1,6}/;
const RE_COMMENT = /(?:rem\s|#)[^\n]*/i;
const RE_NUMERIC_LITERAL_HEX = /(?<![a-z_])0(?:x|X)[0-9a-fA-F]+/;
const RE_NUMERIC_LITERAL_BIN = /(?<![a-z_])0(?:b|B)[01]+/;
const RE_NUMERIC_LITERAL_OCT = /(?<![a-z_])0(?:o|O)[0-7]+/;
const RE_NUMERIC_LITERAL_SCI = /(?:(?<=div|mod|and|or|xor|not)|(?<![a-z_][a-z0-9_]*))(?:[0-9]+\.?[0-9]*|[0-9]*\.?[0-9]+)(?:[eE][+-]?[0-9]+)?(?!\.)/;
const RE_KEYWORD = /(?<![a-z_])(?<![a-z_][0-9]+)(?:print|input|goto|gosub|return|if|else|end|forward|for|to|step|next|break|continue|stop|repeat|while|until|loop|deg|rad|gon|turn|pos|cls|delay|bg|fg|move|draw|plot|stroke|fill|text|copy|restore|frame|getpixel|dim|push|pop|insert|remove|show|hide|forward|backward|left|right|penup|pendown|angle|note|play|rest|quiet|bpm|volume|envelope|speak|voice)/i;
const RE_FUNCTION_NAME = /(?<![a-z_])(?<![a-z_][0-9]+)(?:sin|cos|tan|asin|acos|atan|log|ln|sqrt|round|floor|ceil|abs|asc|bin\$|oct\$|hex\$|bin|oct|hex|len|last|lower\$|upper\$|trim\$|ltrim\$|rtrim\$|chr\$)/i;
const RE_CONSTANT = /(?<![a-z0-9_])(?:pi|e|phi|epoch|random|col|row|key|heading)(?![a-z0-9_])/i;
const RE_OPERATOR = /\+|-|\*|\/|\^|(?<![a-z_])(?:div|mod)(?![a-z_])|&|\||~|;/i;
const RE_COMPARATOR = /!=|<=|>=|=|<|>/i;
const RE_LOGICAL_OPERATOR = /(?<![a-z_])(?<![a-z_][0-9]+)(?:and|or|xor|not)/i;
const RE_IDENTIFIER = /[a-z_][a-z0-9_]*[$%]?/i;
const RE_EXPRESSION_BRACKET = /[()]/;
const RE_LIST_ACCESS_BRACKET = /[\[\]]/;
const RE_PARAMETER_SEPERATOR = /,/;
const RE_STATEMENT_SEPERATOR = /:/;
const RE_WHTIESPACE = /\s+/;

const RE_OR = /|/;

const RE_ALL = new RegExp([
    RE_STRING_LITERAL.source,
    RE_LINE_NUMBER.source,
    RE_COMMENT.source,
    RE_NUMERIC_LITERAL_HEX.source,
    RE_NUMERIC_LITERAL_BIN.source,
    RE_NUMERIC_LITERAL_OCT.source,
    RE_NUMERIC_LITERAL_SCI.source,
    RE_KEYWORD.source,
    RE_FUNCTION_NAME.source,
    RE_CONSTANT.source,
    RE_OPERATOR.source,
    RE_COMPARATOR.source,
    RE_LOGICAL_OPERATOR.source,
    RE_IDENTIFIER.source,
    RE_EXPRESSION_BRACKET.source,
    RE_LIST_ACCESS_BRACKET.source,
    RE_PARAMETER_SEPERATOR.source,
    RE_STATEMENT_SEPERATOR.source,
    RE_WHTIESPACE.source
].join(RE_OR.source), "gi");

const KEYWORD_COLOURS = {
    "print": {background: "purple", foreground: "white"},
    "input": {background: "purple", foreground: "white"},
    "goto": {background: "blue", foreground: "white"},
    "gosub": {background: "blue", foreground: "white"},
    "return": {background: "blue", foreground: "white"},
    "if": {background: "blue", foreground: "white"},
    "else": {background: "blue", foreground: "white"},
    "then": {background: "blue", foreground: "white"},
    "end": {background: "blue", foreground: "white"},
    "for": {background: "blue", foreground: "white"},
    "to": {background: "blue", foreground: "white"},
    "step": {background: "blue", foreground: "white"},
    "next": {background: "blue", foreground: "white"},
    "break": {background: "blue", foreground: "white"},
    "continue": {background: "blue", foreground: "white"},
    "stop": {background: "blue", foreground: "white"},
    "repeat": {background: "blue", foreground: "white"},
    "while": {background: "blue", foreground: "white"},
    "until": {background: "blue", foreground: "white"},
    "loop": {background: "blue", foreground: "white"},
    "deg": {background: "magenta", foreground: "white"},
    "rad": {background: "magenta", foreground: "white"},
    "gon": {background: "magenta", foreground: "white"},
    "turn": {background: "magenta", foreground: "white"},
    "pos": {background: "purple", foreground: "white"},
    "cls": {background: "purple", foreground: "white"},
    "delay": {background: "blue", foreground: "white"},
    "bg": {background: "purple", foreground: "white"},
    "fg": {background: "purple", foreground: "white"},
    "move": {background: "purple", foreground: "white"},
    "draw": {background: "purple", foreground: "white"},
    "plot": {background: "purple", foreground: "white"},
    "stroke": {background: "purple", foreground: "white"},
    "fill": {background: "purple", foreground: "white"},
    "text": {background: "purple", foreground: "white"},
    "copy": {background: "purple", foreground: "white"},
    "restore": {background: "purple", foreground: "white"},
    "frame": {background: "purple", foreground: "white"},
    "getpixel": {background: "purple", foreground: "white"},
    "dim": {background: "yellow", foreground: "black"},
    "push": {background: "yellow", foreground: "black"},
    "pop": {background: "yellow", foreground: "black"},
    "insert": {background: "yellow", foreground: "black"},
    "remove": {background: "yellow", foreground: "black"},
    "show": {background: "green", foreground: "white"},
    "hide": {background: "green", foreground: "white"},
    "forward": {background: "green", foreground: "white"},
    "backward": {background: "green", foreground: "white"},
    "left": {background: "green", foreground: "white"},
    "right": {background: "green", foreground: "white"},
    "penup": {background: "green", foreground: "white"},
    "pendown": {background: "green", foreground: "white"},
    "angle": {background: "green", foreground: "white"},
    "note": {background: "pink", foreground: "white"},
    "play": {background: "pink", foreground: "white"},
    "rest": {background: "pink", foreground: "white"},
    "quiet": {background: "pink", foreground: "white"},
    "bpm": {background: "pink", foreground: "white"},
    "volume": {background: "pink", foreground: "white"},
    "envelope": {background: "pink", foreground: "white"},
    "speak": {background: "pink", foreground: "white"},
    "voice": {background: "pink", foreground: "white"}
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
export class LogicalOperator extends Token {}
export class StringConcat extends Token {}

export class ExpressionBracket extends Token {
    isOpening() {
        return this.code == "(";
    }
}

export class ListAccessBracket extends Token {
    isOpening() {
        return this.code == "[";
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

export class ListAccessIdentifier extends Identifier {
    constructor(listIdentifier, childExpression, lineNumber = null) {
        super(null, lineNumber);

        this.listIdentifier = listIdentifier;
        this.childExpression = childExpression;
    }

    get value() {
        return basic.getListItem(this.listIdentifier.code, this.childExpression.value, this.lineNumber);
    }
}

export class Expression extends Token {
    constructor(tokens, operator = null, childExpressionClass = null, lineNumber = null) {
        super(null, lineNumber);

        this.tokens = tokens;
        this.operator = operator;
        this.childExpressionClass = childExpressionClass;

        this.children = [];
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
        if (!(this instanceof LeafExpression)) {
            return this.children[0].getPrimaryIdentifier();
        }

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
        if (this.code.toLocaleLowerCase() == "tan" && this.expression.value % 90 == 0 && this.expression.value % 180 != 0) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        if (["asin", "acos", "atan"].includes(this.code.toLocaleLowerCase()) && (this.expression.value < -1 || this.expression.value > 1)) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        if (["log", "ln"].includes(this.code.toLocaleLowerCase()) && this.expression.value <= 0) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        if (this.code.toLocaleLowerCase() == "sqrt" && this.expression.value < 0) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        if (this.code.toLocaleLowerCase() == "last" && typeof(this.expression.value) != "object") {
            throw new basic.RuntimeError("Cannot get last item of non-list value", this.lineNumber);
        }

        if (this.code.toLocaleLowerCase() == "chr$" && Number.isNaN(Number(this.expression.value))) {
            throw new basic.RuntimeError("Type conversion error", this.lineNumber);
        }

        if (["bin$", "oct$", "hex$"].includes(this.code.toLocaleLowerCase()) && Number.isNaN(Number(this.expression.value))) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        switch (this.code.toLocaleLowerCase()) {
            case "sin": return Math.sin(basic.trigModeToRadians(this.expression.value));
            case "cos": return Math.cos(basic.trigModeToRadians(this.expression.value));
            case "tan": return Math.tan(basic.trigModeToRadians(this.expression.value));
            case "asin": return basic.radiansToTrigMode(Math.asin(this.expression.value));
            case "acos": return basic.radiansToTrigMode(Math.acos(this.expression.value));
            case "atan": return basic.radiansToTrigMode(Math.atan(this.expression.value));
            case "log": return Math.log10(this.expression.value);
            case "ln": return Math.log(this.expression.value);
            case "sqrt": return Math.sqrt(this.expression.value);
            case "round": return Math.round(this.expression.value);
            case "floor": return Math.floor(this.expression.value);
            case "ceil": return Math.ceil(this.expression.value);
            case "abs": return Math.abs(this.expression.value);
            case "asc": return String(this.expression.value).charCodeAt(0) || 0;
            case "bin": return Number.parseInt(this.expression.value, 2);
            case "oct": return Number.parseInt(this.expression.value, 8);
            case "hex": return Number.parseInt(this.expression.value, 16);
            case "lower$": return String(this.expression.value).toLocaleLowerCase();
            case "upper$": return String(this.expression.value).toLocaleUpperCase();
            case "trim$": return String(this.expression.value).trim();
            case "ltrim$": return String(this.expression.value).trimLeft();
            case "rtrim$": return String(this.expression.value).trimRight();
            case "chr$": return String.fromCharCode(this.expression.value);
            case "bin$": return Number(this.expression.value).toString(2);
            case "oct$": return Number(this.expression.value).toString(8);
            case "hex$": return Number(this.expression.value).toString(16);

            case "len":
                if (typeof(this.expression.value) == "object") {
                    return this.expression.value.length;
                }

                return String(this.expression.value).length;

            case "last":
                if (this.expression.value.length == 0) {
                    throw new basic.RuntimeError("Cannot get last item from empty list");
                }

                return this.expression.value[this.expression.value.length - 1];
        }
    }
}

export class StringConcatExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator(";"), SubtractionExpression, lineNumber);
    }

    parse() {
        this.children = [new this.childExpressionClass([], this.lineNumber)];

        var bracketLevel = 0;
        var bracketTokens = [];
        var chosenFunction = null;
        var chosenListIdentifier = null;

        for (var i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i] instanceof Function && bracketLevel == 0) {
                chosenFunction = this.tokens[i];

                continue;
            }

            if (this.tokens[i] instanceof ListAccessBracket && this.tokens[i].isOpening() && bracketLevel == 0) {
                if (this.children[this.children.length - 1].tokens.length > 0 && this.children[this.children.length - 1].tokens[this.children[this.children.length - 1].tokens.length - 1] instanceof Identifier) {
                    chosenListIdentifier = this.children[this.children.length - 1].tokens.pop();
                } else {
                    throw new basic.ParsingSyntaxError("Expected operator", this.tokens[i].lineNumber);
                }
            }

            if ((this.tokens[i] instanceof ExpressionBracket || this.tokens[i] instanceof ListAccessBracket) && this.tokens[i].isOpening()) {
                if (bracketLevel > 0) {
                    bracketTokens.push(this.tokens[i]);
                }

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
                } else {
                    bracketTokens.push(this.tokens[i]);
                }

                continue;
            }

            if (this.tokens[i] instanceof ListAccessBracket) {
                bracketLevel--;

                if (bracketLevel == 0) {
                    var expression = new this.constructor(bracketTokens, this.lineNumber);

                    expression.parse();

                    var listAccess = new ListAccessIdentifier(chosenListIdentifier, expression, this.lineNumber);

                    if (bracketLevel > 0) {
                        bracketTokens.push(listAccess);
                    } else {
                        this.children[this.children.length - 1].tokens.push(listAccess);
                    }

                    chosenListIdentifier = null;
                    bracketTokens = [];

                    continue;
                }
            }

            if (bracketLevel > 0) {
                bracketTokens.push(this.tokens[i]);

                continue;
            }

            if (chosenFunction != null) {
                throw new basic.ParsingSyntaxError("Expected value after function name", this.lineNumber);
            }

            if (this.tokens[i] instanceof Operator && this.tokens[i].code == this.operator.code) {
                this.children.push(new this.childExpressionClass([], this.lineNumber));
            } else {
                this.children[this.children.length - 1].tokens.push(this.tokens[i]);
            }
        }

        if (bracketLevel < 0) {
            throw new basic.ParsingSyntaxError("Expected an opening bracket", this.lineNumber);
        }

        if (bracketLevel > 0) {
            throw new basic.ParsingSyntaxError("Expected a closing bracket", this.lineNumber);
        }

        this.children.forEach((i) => i.parse());
    }

    get value() {
        var value = this.children[0].value;

        for (var i = 1; i < this.children.length; i++) {
            if (this.children[i].tokens.length > 0) {
                value = this.reduce(value, this.children[i].value);
            }
        }

        return value;
    }

    get postConcat() {
        return this.children[this.children.length - 1].tokens.length == 0;
    }

    reduce(a, b) {
        var value = basic.getValueDisplay(a, this.lineNumber) + basic.getValueDisplay(b, this.lineNumber);

        if (value.length > 1_000_000) {
            throw new basic.RuntimeError("Maximum string length limit reached", this.lineNumber);
        }

        return value;
    }
}

export class SubtractionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("-"), AdditionExpression, lineNumber);
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
        var value = a + b;

        if (typeof(value) == "string") {
            return NaN;
        }

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
        if (b == 0) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        return a / b;
    }
}

export class ExponentiationExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("^"), IntegerDivisionExpression, lineNumber);
    }

    reduce(a, b) {
        return Math.pow(a, b);
    }
}

export class IntegerDivisionExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("div"), ModuloExpression, lineNumber);
    }

    reduce(a, b) {
        if (b == 0) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        return Math.floor(a / b);
    }
}

export class ModuloExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("mod"), BitwiseAndExpression, lineNumber);
    }

    reduce(a, b) {
        if (b == 0) {
            throw new basic.RuntimeError("Maths error", this.lineNumber);
        }

        return a % b;
    }
}

export class BitwiseAndExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("&"), BitwiseOrExpression, lineNumber);
    }

    reduce(a, b) {
        return a & b;
    }
}

export class BitwiseOrExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("|"), BitwiseXorExpression, lineNumber);
    }

    reduce(a, b) {
        return a | b;
    }
}

export class BitwiseXorExpression extends Expression {
    constructor(tokens, lineNumber = null) {
        super(tokens, new Operator("~"), LeafExpression, lineNumber);
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
        if (this.tokens.length == 0) {
            return 0;
        }

        return this.tokens[0].value;
    }
}

export function highlight(code, index, col, row) {
    var defaultBackground = term.backgroundColour;
    var defaultForeground = term.foregroundColour;
    var match;
    var codeChars = Array.from(code);

    function useForeground(name, alpha = 1) {
        var foregroundColour = canvas.colourScheme[canvas.COLOUR_NAMES[name]].clone();

        foregroundColour.alpha = alpha;

        if (!foregroundColour.matches(defaultBackground)) {
            term.setColours(defaultBackground, foregroundColour);
        } else {
            term.setColours(defaultBackground, defaultForeground);
        }
    }

    term.setColours(new canvas.Colour(0, 0, 0, 0), defaultForeground);

    term.goto(col, row);
    term.print(codeChars[index], false, false);

    var bracketLevel = 0;

    while (match = RE_ALL.exec(code)) {
        var start = match.index;
        var length = match[0].length;
        var startOriginal = start;
        var codePos = 0;

        // console.log(code, codeChars, start);
        // debugger;

        for (var i = 0; i < codeChars.length; i++) {
            if (codePos > startOriginal) {
                break;
            }

            var extraCodepoints = codeChars[i].length - 1;

            codePos += extraCodepoints + 1;
            start -= extraCodepoints;
        }

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
        } else if (RE_COMMENT.exec(match)) {
            useForeground("darkgrey");
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
        } else if (RE_CONSTANT.exec(match)) {
            if (index == start) {
                setColourByName("lightblue");
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
        } else if (RE_LIST_ACCESS_BRACKET.exec(match)) {
            useForeground("yellow");
        } else if (RE_OPERATOR.exec(match)) {
            useForeground("magenta");
        } else if (RE_COMPARATOR.exec(match) || RE_LOGICAL_OPERATOR.exec(match)) {
            useForeground("blue");
        } else if (RE_STATEMENT_SEPERATOR.exec(match)) {
            useForeground("blue");
        }

        term.goto(col, row);
        term.print(codeChars[index], false, false);
    }

    term.setColours(defaultBackground, defaultForeground);
}

export function tokeniseLine(code, lineNumber = null) {
    var tokens = [];
    var lineSymbols = [];
    var expressionTokens = [];
    var commentMatch;
    var match;

    if (commentMatch = RE_COMMENT.exec(code.replace(new RegExp(RE_STRING_LITERAL, "g"), function(matchedString) {
        return "\0".repeat(matchedString.length);
    }))) {
        code = code.substring(0, commentMatch.index);
    }

    while (match = RE_ALL.exec(code)) {
        lineSymbols.push(match[0]);
    }

    function computeExpressionTokens() {
        if (expressionTokens.length == 0) {
            return;
        }

        tokens.push(new StringConcatExpression(expressionTokens, lineNumber));
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

        if (RE_LOGICAL_OPERATOR.exec(lineSymbols[i])) {
            computeExpressionTokens();
            tokens.push(new LogicalOperator(lineSymbols[i], lineNumber));

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

        if (RE_OPERATOR.exec(lineSymbols[i])) {
            expressionTokens.push(new Operator(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_IDENTIFIER.exec(lineSymbols[i]) || RE_CONSTANT.exec(lineSymbols[i])) {
            expressionTokens.push(new Identifier(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_EXPRESSION_BRACKET.exec(lineSymbols[i])) {
            expressionTokens.push(new ExpressionBracket(lineSymbols[i], lineNumber));

            continue;
        }

        if (RE_LIST_ACCESS_BRACKET.exec(lineSymbols[i])) {
            expressionTokens.push(new ListAccessBracket(lineSymbols[i], lineNumber));
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

export function renderDocumentationSyntaxHighlighting(code) {
    var element = document.createElement("div");
    var match;

    function addHighlight(classes, code) {
        var highlight = document.createElement("span");

        classes.forEach((i) => highlight.classList.add(i));

        highlight.textContent = code;

        element.appendChild(highlight);
    }

    var bracketLevel = 0;

    while (match = RE_ALL.exec(code)) {
        if (RE_STRING_LITERAL.exec(match)) {
            addHighlight(["stringLiteral"], match[0]);
        } else if (RE_COMMENT.exec(match)) {
            addHighlight(["comment"], match[0]);
        } else if (RE_KEYWORD.exec(match)) {
            var keyword = match.toString().toLocaleLowerCase();

            addHighlight(["keyword", KEYWORD_COLOURS[keyword].background], match[0]);
        } else if (
            RE_NUMERIC_LITERAL_HEX.exec(match) ||
            RE_NUMERIC_LITERAL_BIN.exec(match) ||
            RE_NUMERIC_LITERAL_OCT.exec(match) ||
            RE_NUMERIC_LITERAL_SCI.exec(match)
        ) {
            addHighlight(["other"], match[0]);
        } else if (RE_FUNCTION_NAME.exec(match)) {
            addHighlight(["function"], match[0]);
        } else if (RE_CONSTANT.exec(match)) {
            addHighlight(["constant"], match[0]);
        } else if (RE_EXPRESSION_BRACKET.exec(match)) {
            if (match == "(") {
                bracketLevel++;
            }

            if (bracketLevel > 0) {
                addHighlight(["bracket", `bracket${Math.min(bracketLevel, 3)}`], match[0]);
            } else {
                addHighlight(["badBracket"], match[0]);
            }

            if (match == ")") {
                bracketLevel--;
            }
        } else if (RE_LIST_ACCESS_BRACKET.exec(match)) {
            addHighlight(["listAccess"], match[0]);
        } else if (RE_OPERATOR.exec(match)) {
            addHighlight(["operator"], match[0]);
        } else if (RE_COMPARATOR.exec(match) || RE_LOGICAL_OPERATOR.exec(match)) {
            addHighlight(["comparator"], match[0]);
        } else if (RE_STATEMENT_SEPERATOR.exec(match)) {
            addHighlight(["statementSeperator"], match[0]);
        } else {
            addHighlight(["other"], match[0]);
        }
    }

    return element.innerHTML;
}
import * as canvas from "./canvas.js";
import * as term from "./term.js";
import * as basic from "./basic.js";
import * as syntax from "./syntax.js";

export var hidLog;
export var hidLive;
export var hidInput;
export var hidCopy;
export var hidLogOutputBuffer = "";

export var currentInput = null;
export var programInputs = [];

export var lastHidInputLength = 0;

export const inputFormats = {
    PROGRAM: 0,
    TEXT: 1
};

function getCaretFormatColourInsensitive(format) {
    switch (format) {
        case inputFormats.PROGRAM:
            return canvas.colourScheme[canvas.COLOUR_NAMES.pink].clone();

        default:
            return canvas.colourScheme[canvas.COLOUR_NAMES.darkblue].clone();
    }
}

function getCaretFormatColour(format) {
    var colour = getCaretFormatColourInsensitive(format);

    if (colour.matches(term.backgroundColour)) {
        colour = canvas.colourScheme[canvas.COLOUR_NAMES.black].clone();
    }

    return colour;
}

export class Input {
    constructor(format, relativeRow, value = "", offset = 0) {
        this.format = format;
        this.relativeRow = relativeRow;
        this.value = value;
        this.offset = offset;

        this.scrollColumn = 0;
        this.caretPosition = value.length;
        this.selectionEndPosition = value.length;
        this.callback = function() {};
        this.discarderCallback = function() {};
    }

    get valueChars() {
        return Array.from(this.value);
    }

    bindCallback(callback) {
        this.callback = callback;
    }

    bindDiscarderCallback(callback) {
        this.discarderCallback = callback;
    }

    render(annotations = true) {
        var absoluteRow = this.relativeRow - term.scrollDelta;
        var caretColour = getCaretFormatColour(this.format);
        var selectionColour = getCaretFormatColour(this.format);
    
        caretColour.alpha = (Math.sin((new Date().getTime() / 500) * Math.PI) + 1) / 2;
        selectionColour.alpha = 0.5;

        canvas.setColour(term.backgroundColour);
        canvas.fillRect(
            this.offset * canvas.CHAR_WIDTH,
            absoluteRow * canvas.CHAR_HEIGHT,
            canvas.DISP_WIDTH,
            (absoluteRow + 1) * canvas.CHAR_HEIGHT
        );

        if (this.scrollColumn < 0) {
            this.scrollColumn = 0;
        }

        for (var i = 0; i <= this.valueChars.length; i++) {
            var absoluteCol = this.offset + i - this.scrollColumn;

            if (this.format != inputFormats.PROGRAM && (absoluteCol < this.offset || absoluteCol >= canvas.TERM_COLS)) {
                continue;
            }

            if (i < this.valueChars.length) {
                if (this.format == inputFormats.PROGRAM) {
                    syntax.highlight(this.value, i, absoluteCol, absoluteRow);
                } else {
                    term.goto(absoluteCol, absoluteRow);
                    term.print(this.valueChars[i], false, false);
                }
            }

            if (annotations && i == this.caretPosition) {
                canvas.setColour(caretColour);
                canvas.fillRoundedRect(
                    (absoluteCol * canvas.CHAR_WIDTH) + 1,
                    absoluteRow * canvas.CHAR_HEIGHT,
                    (absoluteCol * canvas.CHAR_WIDTH) + 5,
                    ((absoluteRow + 1) * canvas.CHAR_HEIGHT) - 2,
                    2
                );
            }
        }

        if (annotations && this.selectionEndPosition - this.caretPosition > 0) {
            canvas.setColour(selectionColour);
            canvas.fillRoundedRect(
                (Math.max(this.offset + this.caretPosition - this.scrollColumn, this.offset) * canvas.CHAR_WIDTH) + 1,
                absoluteRow * canvas.CHAR_HEIGHT,
                (this.offset + this.selectionEndPosition - this.scrollColumn) * canvas.CHAR_WIDTH,
                ((absoluteRow + 1) * canvas.CHAR_HEIGHT) - 2,
                4
            );
        }
    }

    finish(addNewline = true, rendering = true) {
        this.caretPosition = 0;
        this.scrollColumn = 0;

        if (rendering) {
            this.render(false);
        }

        log(this.value + "\n");

        if (addNewline) {
            term.print("\n");
        }
    }

    resume(caretPosition = 0) {
        this.discarderCallback(this.value);

        if (caretPosition > this.valueChars.length) {
            caretPosition = this.valueChars.length;
        }

        hidInput.value = this.value;
        hidInput.selectionStart = caretPosition;
        hidInput.selectionEnd = caretPosition;

        this.caretPosition = caretPosition;
        this.selectionEndPosition = caretPosition;

        if (this.caretPosition - this.scrollColumn <= 2) {
            this.scrollColumn = this.caretPosition - Math.floor((canvas.TERM_COLS - this.offset) / 2);
        }

        if (this.caretPosition - this.scrollColumn >= canvas.TERM_COLS - this.offset - 2) {
            this.scrollColumn = this.caretPosition - Math.floor((canvas.TERM_COLS - this.offset) / 2);
        }
    }

    startSeek() {
        this.finish(false);
        this.callback(this.value, true);
    }

    seekPreviousProgramInput() {
        var currentCaretPosition = this.caretPosition;

        for (var i = this.relativeRow - 1; i >= 0; i--) {
            if (programInputs[i] instanceof Input) {
                if (programInputs[i].relativeRow - term.scrollDelta < 0) {
                    term.scrollUp();

                    programInputs[i].relativeRow = term.scrollDelta;
                }

                this.startSeek();

                currentInput = programInputs[i];

                currentInput.resume(currentCaretPosition);

                return;
            }
        }
    }

    seekNextProgramInput() {
        var currentCaretPosition = this.caretPosition;

        for (var i = this.relativeRow + 1; i < programInputs.length; i++) {
            if (programInputs[i] instanceof Input) {
                if (programInputs[i].relativeRow - term.scrollDelta >= canvas.TERM_ROWS) {
                    term.scrollDown();

                    programInputs[i].relativeRow = term.scrollDelta + canvas.TERM_ROWS - 1;
                }

                this.startSeek();

                currentInput = programInputs[i];

                currentInput.resume(currentCaretPosition);

                return;
            }
        }
    }

    readKey(event) {
        if (event.key == "Enter") {
            this.finish();
            this.callback(this.value);

            return;
        }

        if (event.key == "ArrowLeft" || event.key == "Backspace") {
            if (this.caretPosition - this.scrollColumn <= 2) {
                this.scrollColumn = this.caretPosition - Math.floor((canvas.TERM_COLS - this.offset) / 2);
            }
        } else {    
            if (this.selectionEndPosition - this.scrollColumn >= canvas.TERM_COLS - this.offset - 2) {
                this.scrollColumn = this.selectionEndPosition - Math.floor((canvas.TERM_COLS - this.offset) / 2);
            }
        }

        if (this.format == inputFormats.PROGRAM) {
            if (event.key == "ArrowUp") {
                this.seekPreviousProgramInput();

                return;
            } else if (event.key == "ArrowDown") {
                this.seekNextProgramInput();

                return;
            }
        }

        this.value = hidInput.value;

        var startOffset = 0;
        var startChars = hidInput.selectionStart;

        for (var i = 0; i < this.valueChars.length && hidInput.selectionStart > 0; i++) {
            startOffset -= this.valueChars[i].length - 1;
            startChars -= this.valueChars[i].length;

            if (startChars == 0) {
                break;
            }
        }

        var endOffset = 0;
        var endChars = hidInput.selectionEnd;

        for (var i = 0; i < this.valueChars.length && hidInput.selectionEnd > 0; i++) {
            endOffset -= this.valueChars[i].length - 1;
            endChars -= this.valueChars[i].length;

            if (endChars == 0) {
                break;
            }
        }

        this.caretPosition = hidInput.selectionStart + startOffset;
        this.selectionEndPosition = hidInput.selectionEnd + endOffset;

        this.render();
    }
}

export function log(text) {
    hidLogOutputBuffer += text;
}

export function clearLog() {
    hidLog.innerHTML = "";
}

export function startInput(format = inputFormats.TEXT, relativeRow = term.scrollDelta + term.row, offset = term.col) {
    hidInput.value = "";

    if (canvas.TERM_COLS - offset < 10) {
        term.down();

        offset = 0;
        relativeRow++;
    }

    currentInput = new Input(format, relativeRow, "", offset);

    return new Promise(function(resolve, reject) {
        currentInput.bindCallback(resolve);
    }).then(function(value) {
        currentInput = null;

        return Promise.resolve(value);
    });
}

export function startProgramInput(lineValue = "", immediateEdit = true, relativeRow = term.scrollDelta + term.row, rendering = true) {
    hidInput.value = lineValue;

    var newProgramInput = new Input(inputFormats.PROGRAM, relativeRow, lineValue);

    currentInput = newProgramInput;
    programInputs[relativeRow] = newProgramInput;

    newProgramInput.bindCallback(function(value, movementOnly) {
        basic.processCommand(value, movementOnly);
    });

    newProgramInput.bindDiscarderCallback(function(value) {
        basic.discardCommand(value);
    });

    if (!immediateEdit) {
        newProgramInput.finish(true, rendering);
    }
}

export function getFocusedInput() {
    if (currentInput != null) {
        return currentInput;
    }

    return null;
}

export function unfocusInput() {
    if (currentInput == null) {
        return;
    }

    currentInput.finish();

    currentInput = null;
}

function dispatchInputEvent(event) {
    var focusedInput = getFocusedInput();

    if (focusedInput != null) {
        focusedInput.readKey(event);
    }
}

function renderLoop() {
    var focusedInput = getFocusedInput();

    if (focusedInput != null) {
        focusedInput.render();
    }

    requestAnimationFrame(renderLoop);
}

window.addEventListener("load", function() {
    hidLog = document.querySelector("#hidLog");
    hidLive = document.querySelector("#hidLive");
    hidInput = document.querySelector("#hidInput");
    hidCopy = document.querySelector("#hidCopy");

    canvas.init();
    
    setInterval(function() {
        if (hidLogOutputBuffer == "") {
            return;
        }

        hidLog.textContent += hidLogOutputBuffer.replace(/\n/g, "\u2028");
        hidLogOutputBuffer = "";

        var lines = hidLog.textContent.split("\u2028");

        lines = lines.slice(Math.max(lines.length - 100, 0));
        hidLog.innerHTML = "";

        for (var i = 0; i < lines.length; i++) {
            var lineElement = document.createElement("div");

            lineElement.innerText = lines[i].slice(-100) + (i != lines.length - 1 ? "\u2028" : "");

            hidLog.appendChild(lineElement);
        }

        lines = lines.filter((i) => i.replace(/\u2028/g, "").trim() != "");

        hidLive.textContent = lines[lines.length - 1];
    }, 1000);
});

canvas.onReady(function() {
    canvas.getElement().addEventListener("click", function() {
        hidInput.focus();
    });

    hidInput.addEventListener("keydown", function(event) {
        setTimeout(function() {
            dispatchInputEvent(event);
        }, 10);
    });

    renderLoop();
    hidInput.focus();
});
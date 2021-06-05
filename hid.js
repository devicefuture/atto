import * as canvas from "./canvas.js";
import * as term from "./term.js";

export var hidLog;
export var hidInput;

export var currentInput = null;
export var programInputs = [];

export var lastHidInputLength = 0;

export const inputFormat = {
    PROGRAM: 0,
    TEXT: 1
};

function getCaretFormatColour(format) {
    switch (format) {
        case inputFormat.PROGRAM:
            return canvas.colourScheme[canvas.COLOUR_NAMES.pink].clone();

        default:
            return canvas.colourScheme[canvas.COLOUR_NAMES.darkblue].clone();
    }
}

export class Input {
    constructor(format, relativeRow, value = "", offset = 0) {
        this.format = format;
        this.relativeRow = relativeRow;
        this.value = value;
        this.offset = offset;

        this.scrollColumn = 0;
        this.caretPosition = 0;
        this.selectionEndPosition = 0;
        this.promiseResolver = function() {};
    }

    bindPromiseResolver(resolver) {
        this.promiseResolver = resolver;
    }

    render(annotations = true) {
        var absoluteRow = this.relativeRow - term.scrollDelta;
        var caretColour = getCaretFormatColour();
        var selectionColour = getCaretFormatColour();
    
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

        for (var i = 0; i <= this.value.length; i++) {
            var absoluteCol = this.offset + i - this.scrollColumn;

            if (absoluteCol < this.offset || absoluteCol >= canvas.TERM_COLS) {
                continue;
            }

            if (i < this.value.length) {
                term.goto(absoluteCol, absoluteRow);
                term.print(this.value[i], false);
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
                Math.max(this.offset + this.caretPosition - this.scrollColumn, this.offset) * canvas.CHAR_WIDTH,
                absoluteRow * canvas.CHAR_HEIGHT,
                (this.offset + this.selectionEndPosition - this.scrollColumn) * canvas.CHAR_WIDTH,
                ((absoluteRow + 1) * canvas.CHAR_HEIGHT) - 2,
                4
            );
        }
    }

    finish() {
        this.caretPosition = 0;
        this.scrollColumn = 0;

        this.render(false);
        log(this.value);
        term.print("\n");
    }

    readKey(event) {
        if (event.key == "Enter") {
            this.finish();
            this.promiseResolver(this.value);

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

        this.value = hidInput.value;
        this.caretPosition = hidInput.selectionStart;
        this.selectionEndPosition = hidInput.selectionEnd;

        this.render();
    }
}

export function log(text) {
    hidLog.textContent += text;
}

export function startInput(format = inputFormat.TEXT, relativeRow = term.scrollDelta + term.row, offset = term.col) {
    hidInput.value = "";

    if (canvas.TERM_COLS - offset < 10) {
        term.down();

        offset = 0;
        relativeRow++;
    }

    currentInput = new Input(format, relativeRow, "", offset);

    return new Promise(function(resolve, reject) {
        currentInput.bindPromiseResolver(resolve);
    }).then(function(value) {
        currentInput = null;

        return Promise.resolve(value);
    });
}

export function getFocusedInput() {
    if (currentInput != null) {
        return currentInput;
    }

    return;
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
    hidInput = document.querySelector("#hidInput");

    canvas.init();
});

canvas.onReady(function() {
    canvas.getElement().addEventListener("click", function() {
        hidInput.focus();
    });

    hidInput.addEventListener("keydown", function(event) {
        setTimeout(function() {
            dispatchInputEvent(event);
        });
    });

    renderLoop();
    hidInput.focus();
});
[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Shell commands**

## `help`
```
help
```

Opens this help guide to the side of the display.

Keyboard shortcut: <kbd>f1</kbd>

## `list`
```
list
list linestart
list linestart-lineend
```

Lists the program currently being edited. Specifying `linestart` will list the program starting at that line. Specifying a range (`linestart-lineend`) will list the program only for the lines in that range (such as `list 30-60` listing only lines 30 to 60).

The arrow keys can then be used to go to a line shown on-screen for further editing.

## `run`
```
run
```

Executes the program currently being edited.

Keyboard shortcut: <kbd>f5</kbd>

## `new`
```
new
```

Clears the program currently being edited so that a new program can be written.

## `edit`
```
edit line
```

Brings up the line with the line number given as argument `line` so that it can be edited.

## `renum`
```
renum
```

Renumbers all lines of the program currently being edited so that they are multiples of 10. This is used for adding extra lines in-between existing lines (for example, if a line needs to be added between line 10 and 11, then `renum` will renumber those lines to 10 and 20 so that a new line 15 can be added).

## `export`
```
export
export progname
```

Saves the program currently being edited to the host computer's storage as a `.atto` file. Specifying `progname` will save the program with the given name (so `export game` will save `game.atto`).

Keyboard shortcut: <kbd>ctrl</kbd> + <kbd>s</kbd>

## `import`
```
import
```

Loads a `.atto` program from the host computer's storage.

Keyboard shortcut: <kbd>ctrl</kbd> + <kbd>o</kbd>

## `share`
```
share
```

Copies a link to the host computer's clipboard that can be used to view and run the current program.

## `load`
```
load
```

Loads the program that was edited the last time atto was used. This is useful if a program needs to be restored since the last session but was not saved using `export`.
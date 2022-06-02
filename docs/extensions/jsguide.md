# Making an attoX extension
[attoX](https://atto.devicefuture.org/docspopout.html?page=docs/extensions/index.md) is the extension system for atto, and this guide shows you how to build your own attoX extensions in JavaScript, in addition to giving you a reference for the various commands your extension can use to interface with atto.

## Writing your first script
We suggest using Linux for testing attoX extensions, since our extension-testing bash script is optimised for Linux. If you're on Windows, you might get away with using WSL.

A Linux environment is needed to run the `attox-test` script. This script gives you a means to test your extension locally with an online instance of atto.

Create a new project folder in which you'll be making your atto extension. In the project folder, execute the following to download the `attox-test` script:

```bash
$ wget https://raw.githubusercontent.com/devicefuture/atto/main/extdev/attox-test
$ chmod +x attox-test
```

Create a new file called `hello.attox.js` in the project folder, and enter the following contents:

```javascript
attoX.onReady(function() {
    attoX.registerCommand("greet", function(name) {
        if (data) {
            attoX.print("Hello, " + name + "\n");
        } else {
            attoX.print("Hello, world!\n");
    });

    attoX.print("My first extension loaded!\n");

    attoX.ready();
});
```

Run the following command in the project folder:

```bash
$ ./attox-test hello.attox.js hello
```

Your default browser should now launch atto with our new extension all loaded. In atto, type in the following program:

```atto
10 hello.greet
20 input "What's your name? ", name$
30 hello.greet name$
```

Run the program with `run`. You should see that our `hello` extension is all working with our new `hello.greet` command. Congratulations, you've made your first extension with attoX!

When you make changes, ensure that you run the `attox-test` command again — if you try and refresh an already-open instance of atto, only your previous changes will load.

## `attox-test` command format
The format for the `./atto-test` command is the following:

```
./attox-test [extfile] [extname] [attourl]
```

The arguments are as follows:

* `[extfile]`: The path to the input extension file to load and test
* `[extname]` (defaults to `test`): The name of the extension to use in atto (used for running the extension's commands in the format `extname.command`)
* `[attourl]` (defaults to `https://atto.devicefuture.org`): The URL to atto (can be used to load atto from a local instance)

## `attoX` API reference
Here is a list of commands that you can use in your attoX extensions. All commands return `Promises` that resolve once the command has been processed by atto. This is necessary since extensions run in a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), and therefore communications between extensions and atto are asynchronous.

### `attoX.ready`
```javascript
attoX.ready();
```

Tells atto that the extension has now fully-loaded (for example, that the necessary commands have now been registered). This command would typically be put at the very end of the callback to `attoX.onReady`.

### `attoX.visitDocs`
```javascript
attoX.visitDocs(path = "docs/index.md", popOut = false);
```

Opens the documentation panel to the side of atto, showing the documentation at the path given as argument `path` (this can be a URL to an external Markdown file). If `popout` is `true`, then the documentation will be opened in a new tab instead.

### `attoX.closeDocs`
```javascript
attoX.closeDocs();
```

Closes the documentation panel to the side of atto.

### `attoX.toggleDocs`
```javascript
attoX.toggleDocs();
```

Toggles whether the documentation panel to the side of atto is open or not.

### `attoX.openExternalUrl`
```javascript
attoX.openExternalUrl(url);
```

Opens the webpage at the URL given as argument `url` in a new tab.

### `attoX.isEmbedded`
```javascript
attoX.isEmbedded(); // -> Boolean embedded
```

Determines whether the instance of atto has been embedded into an external webpage or not.

### `attoX.runCommand`
```javascript
attoX.runCommand(command);
```

Executes the atto command given as argument `command`.

### `attoX.setProgram`
```javascript
attoX.setProgram(program);
```

Sets the program that will be executed when `run` is entered into atto to the code given as argument `program`.

### `attoX.getProgram`
```javascript
attoX.getProgram(program); // -> String
```

Gets the code of the program that will be executed when `run` is entered into atto.

### `attoX.renumberProgram`
```javascript
attoX.renumberProgram(program);
```

Renumbers all lines of the current program so that they are multiples of 10. See the [`renum` atto shell command](https://atto.devicefuture.org/docspopout.html?page=docs/reference/shell.md#renum) for more information.

### `attoX.runProgram`
```javascript
attoX.runProgram();
```

Runs the current program. The `Promise` will be resolved when the program has finished running.

### `attoX.interruptProgram`
```javascript
attoX.interruptProgram();
```

Interrupts the current program being executed by atto.

### `attoX.isRunningProgram`
```javascript
attoX.isRunningProgram(); // -> Boolean
```

Reports whether or not a program is currently running in atto.

### `attoX.registerCommand`
```javascript
attoX.registerCommand(commandName, callback);
```

Registers a new command as part of the extension. The name of the command is given as argument `commandName`, and the command is called in atto using the syntax `extname.command`, where `extname` is the name of the extension and `command` is the name of the command to execute within that extension.

When the command is called in atto, the function given as argument `callback` is called with the arguments of the atto command.

### `attoX.setArgValue`
```javascript
attoX.setArgValue(argIndex, argValue);
```

Used within `attoX.registerCommand` to set an atto variable's value by reference when it is passed as an argument as part of executing an extension command. `argIndex` specifies the index of the argument to set (the first argument being `0`), and `argValue` is the value to store in the argument's passed variable.

For example, if an extension called `calc` contains the following code:

```javascript
attoX.registerCommand("add", function(num1, num2, result) {
    attoX.setArgValue(2, num1 + num2);
});
```

...The following atto program will print the value `15` to the display when run as the variable passed at argument index `2` is set accordingly:

```atto
10 calc.add 7, 8, result
20 print result
```

### `attoX.getTrigMode`
```javascript
attoX.getTrigMode(); // -> String
```

Gets the current trigonometry mode in atto (set using the commands `deg`, `rad`, `gon` and `turn`) as a string representing the name of the mode (based on the name of the command used to set the mode).

### `attoX.scrollUp`/`attoX.scrollDown`
```javascript
attoX.scrollUp();
attoX.scrollDown();
```

Scrolls the terminal display up/down one line.

### `attoX.up`/`attoX.down`/`attoX.left`/`attoX.right`
```javascript
attoX.up();
attoX.down();
attoX.left();
attoX.right();
```

Moves the terminal's cursor up/down/left/right by one.

### `attoX.input`
```javascript
attoX.input(message = ""); // -> String
```

Prompts the user with the text given as argument `message`, and resolves with the entered response.

### `attoX.getKey`
```javascript
attoX.getKey(); // -> String
```

Gets the keyboard key currently being held down (equal to the value of `event.key` in JavaScript keyboard events). If no key is being held down, then the value will be `""`.

### `attoX.drawRect`/`attoX.fillRect`
```javascript
attoX.drawRect(x1, y1, x2, y2);
attoX.fillRect(x1, y1, x2, y2);
```

Draws a rectangle to the display from the coordinates given as arguments `x1`, `y1`, `x2` and `y2`. `fillRect` fills in the rectangle. The current foreground colour will be used when drawing the rectangle.

### `attoX.drawRoundedRect`/`attoX.fillRoundedRect`
```javascript
attoX.drawRoundedRect(x1, y1, x2, y2, radius);
attoX.fillRoundedRect(x1, y1, x2, y2, radius);
```

Draws a rounded rectangle to the display from the coordinates given as arguments `x1`, `y1`, `x2` and `y2`, and with radius given as argument `radius`. `fillRoundedRect` fills in the rectangle. The current foreground colour will be used when drawing the rectangle.

### `attoX.drawLine`
```javascript
attoX.drawLine(x1, y1, x2, y2);
```

Draws a line to the display between the coordinates given as arguments `x1`, `y1`, `x2` and `y2`. The current foreground colour will be used when drawing the line.

### `attoX.drawPolygon`
```javascript
attoX.drawPolygon(points);
```

Draws a filled polygon to the display with the coordinates specified as an array in the argument `points` (for example, `[[100, 200], [200, 300], [100, 300]]`). The current foreground colour will be used when drawing the line.

### `attoX.getPixel`
```javascript
attoX.getPixel(x, y); // -> Object {red: Number, green: Number, blue: Number, alpha: Number}
```

Gets the colour details of a pixel at the coordinates given as arguments `x` and `y`.

### `attoX.isDarkMode`
```javascript
attoX.isDarkMode(); // -> Boolean
```

Determins whether or not the dark mode/theme on the host system is enabled.

### `attoX.getBpm`
```javascript
attoX.getBpm(); // -> Number
```

Gets the value of the current BPM (beats per minute) set in atto (which can be chaned in atto by using the [`bpm`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#bpm) command).

### `attoX.getVolume`
```javascript
attoX.getVolume(); // -> Number
```

Gets the value of the current volume level set in atto (which can be chaned in atto by using the [`volume`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#bpm) command).

### `attoX.hostBroadcast`
```javascript
attoX.hostBroadcast(channel); // -> Object {broadcastId: Number, channel: String}
```

Hosts a new attoX data sharing broadcast with the desired channel name given as arugment `channel` (defaults to a random 8-digit number), and resolves with an object containing the broadcast ID to use for communications, as well as the channel name to use when calling `attoX.joinBroadcast` on another device.

The `Promise` is resolved when connected.

### `attoX.joinBroadcast`
```javascript
attoX.joinBroadcast(channel); // -> Object {broadcastId: Number}
```

Joins an attoX data sharing broadcast with the channel name given as argument `channel`, and resolves with an object containing the broadcast ID to use for communications.

The `Promise` is resolved when connected.

### `attoX.broadcastSend`
```javascript
attoX.broadcastSend(id, data);
```

Sends data given as argument `data` to an attoX data sharing broadcast with the broadcast ID given as argument `id`.

### `attoX.broadcastRead`
```javascript
attoX.broadcastRead(id); // -> any ?? null
```

Reads data from the stack of an attoX data sharing broadcast with the broadcast ID given as argument `id`. If there is no data to be read, then command will resolve to `null`.

## attoX commands that mimic atto commands
The following is a list of attoX commands that perform the same functionality as their atto counterparts:

| attoX command | atto command |
|---------------|--------------|
| `attoX.background` | [`bg`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#bg) |
| `attoX.foreground` | [`fg`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#fg) |
| `attoX.goto` | [`pos`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#pos) |
| `attoX.clear` | [`cls`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#cls) |
| `attoX.print` | [`print ...;`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#cls) (no newline appended) |
| `attoX.stroke` | [`stroke`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#stroke) |
| `attoX.resetStroke` | [`stroke 1`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#stroke) |
| `attoX.drawText` | [`text`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#text) |
| `attoX.drawRect` | [`rect`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#stroke) |
| `attoX.copyToBuffer` | [`copy`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#copy) |
| `attoX.restoreFromBuffer` | [`restore`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/io.md#restore) |
| `attoX.setEnvelope` | [`envelope`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#envelope) |
| `attoX.setVoice` | [`voice`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#voice) |
| `attoX.setBpm` | [`bpm`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#bpm) |
| `attoX.setVolume` | [`volume`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#volume) |
| `attoX.playNote` | [`play`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#play) |
| `attoX.quiet` | [`quiet`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#quiet) |
| `attoX.speak` | [`speak`](https://atto.devicefuture.org/docspopout.html?page=docs/reference/audio.md#speak) |

## Features that we'd like to add to attoX soon
While attoX covers the majority of atto's functionality, there's still quite a few features that we'd like to add to attoX soon:

* A [Web USB API](https://developer.mozilla.org/en-US/docs/Web/API/USB) interface
* A [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth) interface
* A [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) interface
* An inter-extension communications interface

If you'd like to help out with building these features, then feel free to contribute by [making a new pull request](https://github.com/devicefuture/atto/pulls)!

## Reporting issues with attoX
Report any issues you have with developing attoX extensions on the [issue tracker for atto](https://github.com/devicefuture/atto/issues). If you have any questions or attoX feature/capability requests, feel free to ask them here, too!

Ensure that you tag your issues with the **attoX** label, in addition to any other labels that are applicable to your issues.
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

```js
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
Coming soon!
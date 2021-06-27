[Guide](/index.md) 🢒 **I can already code well**

If you can already code at an advanced level, then we're confident that you'll find atto a breeze! atto is similar to BASIC, but with modern features to make the language more relevant to today.

Much like BASIC, each program line in atto must begin with a line number, otherwise atto will instead immediately execute that command in the shell. For the sake of convenient editing, it is suggested that each line number in atto should be a multiple of 10 (`10`, `20`, `30`) etc. so that lines can be added in-between. The `renum` command can be called in the shell to renumber the program in this way if you run out of lines.

Here is a basic demo of the infamous `Hello, world!` program:

```
10 print "Hello, world!"
20 goto 10
```

This example will continuously write `Hello, world!` to the screen until you press the Esc key to interrupt it. You can run this example with the `run` command.

---

Since atto is a full programming language, variables can also unsurprisingly be used:

```
10 untyped=10.5
20 number%=7
30 string$="Hello!"
40 print untyped; ", "; number%; ", "; string$
```

As you can see, variables may be suffixed with a sigil symbol to cast them to a particular type. The `$` sigil will convert a variable to a string, and the `%` sigil will convert a variable to a number. Variables are case-insensitive to aid editing for learners.

This example also features the string concatenation operator (`;`), which can additionally be used at the end of a `print` command to prevent the automatic printing of a newline character at the end of a string.
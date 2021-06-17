[Guide](javascript:visitDocumentation('docs/index.md');) > **I've played with BASIC before**

If you've used BASIC before, then atto will be very familiar to you. atto is a BASIC-like language — atto is essentially BASIC, but with a few modern features added in.

Try running the infamous `Hello, world!` program to see what we mean by it being familiar:

```
10 print "Hello, world!"
20 goto 10
```

You'll notice that atto has syntax highlighting, which is a step up from the original BASIC langauge, and makes it much easier to read (especially for beginners)!

You can use `run` to run the program, and you can use the `list` command to list the contents of your program. Notice how you can use the arrow keys to go up and down a line to edit your code — this is what makes atto unique from BASIC, in that editing in atto is easier and similar to other programming languages.

For editing your code, the `edit` command (such as running `edit 10`) can be used to modify a line, and the `renum` command can be used to renumber each line number of your program to be a factor of 10 if you run out of in-between lines. It'll even renumber the `goto` commands for you!

Importantly, the `new` command will create a new program, which is useful for tinkering with atto to make different projects.

atto supports storing strings and numbers in variables:

```
10 rem Storing a string:
20 string$="Hello!"
30 rem Storing a number:
40 number%=16
50 print string$
60 print number%
```

The `$` suffix will cast a variable to a string, and the `%` suffix will cast a variable to a number. Input works as expected, too:

```
10 input "Enter a number: ", number%
20 print number%; " divided by 2 is "; number%/2
```

Here, `;` is a string concatenation operator, whereas `,` is used to delimit the arguments of a command.
[Guide](/index.md) 🢒 **I've used Scratch or Python for learning**

If you've learnt coding before, then great! You're going to be right at home. If you've only used Scratch before, then atto is a bit different because you have to write everything out instead of dragging blocks. If you've used Python, then everything will be quite familiar to you. Either way, it's easy! Let's have a play.

The first thing we can do is tell atto to write `Hello, world!` to the screen. It's highly likely that you've done this before in Scratch or Python, because it's the code that literally _everybody_ writes when they first learn programming! We can easily do this in atto:

```
print "Hello, world!"
```

When you press Enter, you'll notice that atto instantly writes out `Hello, world!` once you've written that line of code. However, we can get atto to store our lines of code in a program so that we can then run it when we're finished with writing it:

```
10 print "Hello, world!"
20 print "I'm using atto!"
```

> **Hint:** Don't forget the speech marks (`"`) around the strings!

When you type `run`, you should see both lines run and both strings appear on-screen. atto relies on having line numbers before each line of your program so that it knows where to store that line. It's in multiples of 10 (`10`, `20`, `30` etc.) so that you can then add in lines if you've missed something. Let's add in another line in-between now by typing:

```
11 print "I'm glad to be here!"
```

If you type in `list`, atto will show your code in full, with all of the lines in order. You can run the `list` command at any time when your program's not running as a reminder of what you've already written.

Let's delete line `11` by simply typing the line number by itself:

```
11
```

This will set line `11` to be empty, and therefore it will no longer exist in our program.

Let's now add in another line to our program, like this:

```
30 goto 10
```

You can probably already guess what this'll do! When you type `run`, you should see your program loop again and again indefinitely. Once you're bored of that, you can then press Esc to interrupt your program and get back to writing more code!

You can type `new` to create a new program and clear out the old one. Let's now play with some variables:

```
10 score=0
20 print "The score is "; score
30 score=score+1
40 goto 20
```

Here, you should notice that the `;` operator exists. Its job is to join two strings together, which can also include joining numbers to strings. Once you've figured out what this code does, run it to see what happens with `run`! You should see that it writes out the variable `score` after `The score is `.

Let's now play around with user input. Type `new` to create a new program. Let's get atto to write out our name when we type it in:

```
10 input "What's your name? ", name$
20 print "Hello, "; name$; "!"
```

On line `10`, we ask the user, `What's your name?`, and we store the user's input into a variable called `name$`. The `$` tells atto that the variable is meant to output a string. The code will then greet the user with their own name.

As well as asking the user for text input, we can also ask the user for numbers, too:

```
10 print "I'll add up two numbers for you"
20 input "What's your first number? ", a%
30 input "What's your second? ", b%
40 sum=a%+b%
50 print "The sum is "; sum
```

Here, `%` tells atto to read the variable's value as a number, which is useful for mathematical operations. We use a variable called `sum` here to store the result of adding `a%` and `b%`, but you could just write `40 print "The sum is "; a%+b%` and it'll do the same thing!
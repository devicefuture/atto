[Guide](/index.md) 🢒 **I've never programmed before**

So, it's your first time programming, huh? Well, we're glad that you're here! Once we've shown you a bit of what we do, you'll be mastering coding in no time!

But first, let's break down what programming really is: computers are really good at following your every command. Programming involves writing instructions that a computer will understand so it can perform each task with 100% accuracy, all within a blink of an eye.

atto is a **programming language**, which much like human languages, is a particular way of communicating with the computer to do something. atto is an easy programming language for humans to understand, so it's the perfect one for you to start with!

---

Let's dive in! In atto, type in the following and press Enter:

```
print "Hello, world!"
```

If you succesfully typed that in, your computer should reply with `Hello, world!` right under it. If so, congrats! You've managed to write a bit of code.

`print` is a command which tells atto to write something to the screen. Have a go at using the `print` command again, but with a different message.

> **Hint:** Did it repeat what you wrote? If not, don't forget the speech marks (`"`) around your message.

---

So, it's great that we can get the computer to directly write stuff when we tell it to. But what about getting it to write multiple things at once? That's where adding line numbers comes in. Adding line numbers to our code tells atto to store our code so that it can run when we say so. Type this in and press Enter:

```
10 print "Hello, world!"
```

The `10` here tells atto to store our `print` command on line 10 of the program we're writing. We'll come onto why we've chosen `10` as a number in a bit. Now, write:

```
20 print "This is my first program!"
```

We've written two lines of code. Let's see what happens when we run it! Type `run` into atto and press Enter. You should see `Hello, world!` followed by `This is my first program!` after you typed `run`. If so, then great!

Now, we're going to introduce a new command... It's called `goto`! Type in the next line of our program into atto:

```
30 goto 10
```

You can then type `list` to see your program's code in full. So, what do you think the `goto` command does?

If you guessed that it'll loop back to line 10 in our program, then you're correct! Type `run` to see what happens.

What you should see is that your code is running forever. Your computer is constantly spurting out `Hello, world!` and `This is my first program!` again and again!

Once you've seen your code run, press the Esc key to stop our program. You'll know that it's stopped because atto will show `Interrupt` on the screen at the bottom — because you interrupted your program.

You can also delete lines in atto if you want to change some code in your program. Type `20` all by itself and see the result when you type `list`. You should see that line 20 is missing — when atto runs your code, it'll jump from line 10 straight to line 30!

> **Note:** Wondered why it's `10`, `20`, `30` instead of `1`, `2`, `3`? That's because if we need to add in more lines, we can then go back and add lines in-between, such as `11 print "I'm a computer!"`. Try typing that in, and then type `list` to see your program's code again!

---

So, we've managed to get the computer to say something, but your computer can do more than that! Computers are really good at performing maths and adding numbers up, among other things. Let's try adding two numbers now:

```
print 3+4
```

When you press Enter, you should see the result of 3 + 4, which is 7. There are other operations too, such as subtracting (`-`), multiplying (`*`) and dividing (`/`). Play around with them to see what you can do.

> **Hint:** Here, you don't need to add speech marks. If you do, you'll see that the computer will simply write `3+4` on the screen, and not actually do the calculation!

We can also store numbers for later, too! Your computer can hold data in its memory in things called **variables**. A variable is a specific location inside your computer that can hold anything you want.

Let's play around with them! Type `new` to delete the current program so we can create a new one. Then, type:

```
10 a=10+4
20 print a
```

What do you think will happen when you run the code?

If you guessed that the number `14` will be printed to the screen, then you are right! Try running the code with `run` to see what happens.

This is all well and good, but it's not really too helpful if our program doesn't require input from the user — AKA us. Let's build a simple calculator which adds two numbers and prints the result:

```
10 input "First number? ", first%
20 input "Second number? ", second%
30 sum=first%+second%
40 print sum
```

> **Note:** The `%` after `first%` and `second%` tell atto to get the contents of the variable as a number, instead of text. Much better for adding!

Run your code. Your computer should be asking you for the first number. Type in a number of your choice and then press Enter. It'll then ask for the second number, which you'll enter another number. Finally, you should see the two numbers of your choice added together!

---

Variables can hold more than just numbers — they can hold text, too! In programming, text is referred to as **strings**. Text and strings mean the same thing, really. Let's write a program that asks for your name and prints it out! Don't forget to type in `new` to start over with our new program:

```
10 input "What's your name? ", name$
20 print "Hello, "; name$; "!"
```

`$` means for atto to read the `name$` variable as a string, which is what we're storing our user's name as. Can you guess what `;` means in our code?

If you guessed that it joins strings together, then you are right! Run the code with `run` to see what happens.

---

You've finished our introductory guide! Now's a great time to move onto our next guide, where you get to draw shapes and patterns to the screen.

<a href="/courses/turtle.md" class="card">Drawing with the turtle 🢒</a>
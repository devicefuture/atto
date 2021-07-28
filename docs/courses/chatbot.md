[Guide](/index.md) 🢒 [Courses](/courses/index.md) 🢒 **Making an interactive chatbot**

In this course, you'll be playing with `if` statements, which are the building blocks of making your own interactive chatbot!

What does '**if**' mean in everyday language? The word '**if**' is used for comparison. For example, suppose you're asked, "if it's raining, get your umbrella out"; what would you do if it was raining, and what would you do if it was sunny?

Well, **if it's raining**, you'd get your umbrella before continuing about your day. And **if it's not raining**, you'd skip getting your umbrella because you don't need it.

---

Programming has a concept of what `if` means, too. It's how computers decide to perform certain actions dependent on if something's happening or not. Our weather example can be portrayed in atto as the following:

```
10 input "What's the weather? ", weather$
20 if weather$="raining"
30 print "Getting my umbrella out"
40 end
50 print "Continuing about my day"
```

Try entering the code above into atto and running it with `run`. Your computer will ask you what the weather is, and if you type in `raining`, it'll print `Getting my umbrella out`, followed by `Continuing about my day`.

If you type in `sunny`, however, it'll only print `Continuing about my day`.

Let's break down what our code does:

1. The `input` command asks the user, `What's the weather?`. The user enters their response, and that response is stored in the `weather$` variable as a string.
2. `weather$="raining"` checks to see if the `weather$` variable's contents is equal to `"raining"`. If so, go to step 3. If it isn't, then skip to step 4.
3. `Getting my umbrella out` is written to the screen.
4. `Continuing about my day` is shown.

---

Let's put our knowledge of what `if` does to practice. In this example, we're going to ask the user to perform a simple calculation. If they get the answer right, we'll tell them that the answer's correct; and if they were wrong, we'll tell them that it's incorrect.

Type `new` and enter the following program:

```
10 input "5+3=? ", answer%
20 if answer%=5+3
30 print "Correct!"
40 else
50 print "Not quite!"
60 end
```

Type `run` to start the program and type in `8` as the answer. Your code should tell you that the answer's correct!

You'll notice that this time, we use the `else` command, which is new. Figure out what it does by running the program again, but this time, entering the incorrect answer.

---

Try making a quiz program that uses `if` and `else`. Ask a multiple-choice question, and get the user to either type `a`, `b`, `c` or `d`. Try adding multiple questions to your program to make a proper quiz!

![A quiz question being asked by an atto program](media/docs/chatbot1.png)

> **Challenge:** Can you add a scoring system which tells the user how many questions they got right? In your `if` statements, you can add `score=score+1` to increase the score when the user gets it right.

<details>
<summary>Solution code</summary>
<pre>
<code>10 score=0</code>
<code>20 print "Welcome to my quiz!"</code>
<code>30 print "Which planet in our Solar System has a ring around it?"</code>
<code>40 print "a) Jupiter"</code>
<code>50 print "b) Venus"</code>
<code>60 print "c) Saturn"</code>
<code>70 print "d) Mercury"</code>
<code>80 input "Your choice: ", answer$</code>
<code>90 if answer$="c"</code>
<code>100 print "Correct!"</code>
<code>110 score=score+1</code>
<code>120 else</code>
<code>130 print "Not quite! It's c."</code>
<code>140 end</code>
<code>150 print "How many strings does a violin have?"</code>
<code>160 print "a) 4"</code>
<code>170 print "b) 6"</code>
<code>180 print "c) 10"</code>
<code>190 print "d) 12"</code>
<code>200 input "Your choice: ", answer$</code>
<code>210 if answer$="a"</code>
<code>220 print "Correct!"</code>
<code>230 score=score+1</code>
<code>240 else</code>
<code>250 print "Not quite! It's a."</code>
<code>260 end</code>
<code>270 print "What colour is a giraffe's tongue?"</code>
<code>280 print "a) white"</code>
<code>290 print "b) purple"</code>
<code>300 print "c) red"</code>
<code>310 print "d) yellow"</code>
<code>320 input "Your choice: ", answer$</code>
<code>330 if answer$="b"</code>
<code>340 print "Correct!"</code>
<code>350 score=score+1</code>
<code>360 else</code>
<code>370 print "Not quite! It's b."</code>
<code>380 end</code>
<code>390 print "Quiz over!"</code>
<code>400 print "Your score is: "; score</code>
</pre>
</details>

---

With `if` conditions, we don't always have to use `=`. We can use inequality operators such as `<`, `>`, `<=` and `>=` to compare ranges of numbers, too!

Now would be a good time to save your quiz code to your computer by typing `export` (you can get it back by using `import`). Then, type `new` to create a new program. Enter the following:

```
10 input "How old are you? ", age%
20 if age%<13
30 print "You're a child!"
40 else if age%<=19
50 print "You're a teenager!"
60 else
70 print "You're an adult!"
80 end
```

As you can see, this program makes use of the `<` and `<=` operators, which mean 'less than' and 'less than or equal to' respectively.

In this example, we're comparing the user's age and firstly seeing if they're under 13 years old. If they aren't, we compare to see if they are 19 years old or younger. Otherwise, we say that they are an adult.

This example also includes the new `else if` statement. By running the program, can you explain what it does?

---

We're nearly at the end of this course! However, we haven't yet created a chatbot. Let's introduce you to the `speak` command. Try it in atto to see what it does:

```
speak "Hello, world!"
```

Make sure that your computer's volume is turned up to listen to what it says. If you can't hear it, you'll have to use the `print` command for your chatbot instead (which writes whatever needs to be said to the screen).

We're going to ask the user a question, and answer with a matching reply. Let's make a start:

```
10 speak "How can I help?"
20 input question$
30 if question$="What's your name?"
40 speak "I'm attobot! It's nice to meet you. What's your name?"
50 input name$
60 speak "Nice to meet you, "; name$; "!"
70 else if question$="How are you?"
80 speak "I'm good, thanks!"
90 else if question$="What's the weather?"
100 speak "It's quite sunny!"
110 else
120 speak "I don't understand. Can you ask another question?"
130 end
140 goto 20
```

Add more responses before line 110 to make the chatbot your own! What about adding in a game of rock paper scissors?
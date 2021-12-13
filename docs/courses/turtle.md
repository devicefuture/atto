[Guide](/index.md) 🢒 [Courses](/courses/index.md) 🢒 **Drawing with the turtle**

In this course, you'll be entering the wonderful world of graphics! Trust me, it's much more exciting than writing programs that ask for your name...

atto has a little robot hidden inside it called a turtle. With just a few lines of code, you'll be able to take control of this robot, drawing patterns as it leaves a trail when moving around the screen!

---

Let's start by writing a simple program that gets our turtle to move. First, type `new` to clear any current programs that are stored in atto, and then type this in:

```
10 forward 100
20 left 90
30 forward 100
```

Type `run` and press Enter. You should see something like this appear on your screen:

![Two lines, which are connected to each other at a right angle, drawn to the screen](media/docs/turtle1.png)

That arrow is our turtle, and as you can see, it's performed each command in our code! We asked the turtle to move forward by 100 pixels, then turn left by 90°, and finally move forwards by 100 pixels after turning.

If we write some more code, we can get the turtle to draw a square. Add the following lines of code and then type `run`:

```
40 left 90
50 forward 100
60 left 90
70 forward 100
```

It's quite annoying having to type in the same lines of code again and again, but when you run it, you should see the turtle draw a nice square.

---

There is, however, an easier way to draw squares without having to repeat the same lines of code multiple times! Let's clear our program by typing the `new` command.

In atto, we can make loops that run the same commands, again and again. You've already used the `goto` command to make something run forever, but now it's time to introduce the `for` loop!

The `for` loop will repeat the same code for a fixed number of times. This is perfect for drawing our square, since there's four sides, and we can get our turtle to draw each side four times. Enter the following code:

```
10 cls
20 for i=1 to 4
30 forward 100
40 left 90
50 next
```

This time, if you run the code, you should see that our turtle draws a perfect square:

![A perfect square, drawn by the turtle](media/docs/turtle2.png)

Let's break down what our code does:

1. The `cls` command clears the screen before running our program, which makes it easier to see our turtle draw the square.
2. `for i=1 to 4` repeats the code below it 4 times.
3. `forward 100` and `left 90` both draw one side of our square, as you saw earlier.
4. `next` closes the `for` loop, which tells atto what lines of code are in our loop.

---

Now, let's adapt our code to draw a triangle! Type `list` to see our code again. You should then see the code that draws our square. Use the arrow keys on your computer to move up to line 20, and change the `4` to be a `3`. You'll also need to change the angle that our turtle turns left by from `90` to `120`.

Then, use the Down arrow to go to the bottom of our code, and then type `run` and press Enter. You should now see our turtle draw a triangle!

![A triangle, drawn by the turtle](media/docs/turtle3.png)

> **Hint:** Why do we tell our turtle to turn 120° instead of 90° this time? That's because when our turtle gets to the end of drawing a line, it has to turn more than 90° to draw the next line. Try entering different values other than `120` to see what happens!

Try editing your code to make it draw a circle. Use the arrow keys to go back and change the numbers in your code, and then use the Down arrow to get to the last line, and type `run`.

---

We can do some cool effects using the `for` loop in atto. The variable `i` in our `for` loop can be used to find how many times we've already repeated our code. Type `new` and then the following:

```
10 for i=1 to 10
20 print "Number "; i
30 next
```

You should see that atto prints `Number 1`, then `Number 2`, all the way up to `Number 10` when you run your code. The `for` loop lets you do more cool things, which we'll show you in a moment!

Type in `new` again and then type in this:

```
10 cls
20 for i=1 to 10
30 forward 100+i*20
40 right 120
50 next
```

This code is very similar to our original triangle-drawing program, but with a twist! What do you think will happen when we run this code?

If you guessed that it will draw a triangular spiral, then correct! Run your code to see what happens.

![A triangular spiral, drawn by the turtle](media/docs/turtle4.png)

Each turn, the sides of our triangle grow bigger. When we run our program, the turtle draws a line which is 100 pixels long. It then turns right by 120°, and draws a line of 120 pixels in length. It then turns again, this time, drawing a line of 140 pixels in length, and so on!

This is called **iteration** because we _iterate_ through our line-drawing code, with the line we draw growing bigger each time.

---

Let's now change the colour of the trail that our turtle draws to make our triangle spiral look nicer! Type in `list` to show your program's code again, and then type in the following to add it into the top of your program:

```
5 fg "green"
```

Now, when you run your code, the spiral should now be in green. The `fg` command sets the _foreground_ colour, or the colour which the turtle draws with. Try changing the colour to something different by typing `edit 5`, and then run your code again.

Experiment with your code — can you change the size of the spiral which is drawn? The number of steps the turtle takes to draw the spiral? The angle at which the turtle turns each time? Use your creativity to draw something cool!

---

## Project activity
Now you've learnt how to draw patterns using atto's turtle, try drawing a house to the screen, such as this one:

![A house with a window and a door, drawn by the turtle](media/docs/turtle5.png)

Here's some more commands which may help you in doing this:

* [`backward 100`](/reference/turtle.md#backward): Move the turtle backward by 100 pixels
* [`penup`](/reference/turtle.md#penup): Tell the turtle to stop drawing a trail when it moves around
* [`pendown`](/reference/turtle.md#pendown): Tell the turtle to start drawing a trail when it moves around
* [`fill`](/reference/io.md#fill): Fill in the shape that the turtle has drawn
* [`hide`](/reference/turtle.md#hide): Make the turtle disappear from the screen, which is useful when you've finished drawing
* [`show`](/reference/turtle.md#show): Make the turtle appear again

<details>
<summary>Solution code</summary>
<pre>
<code>10 cls</code>
<code>20 fg "green"</code>
<code>30 forward 200</code>
<code>40 backward 180</code>
<code>50 fg "brown"</code>
<code>60 left 90</code>
<code>70 forward 100</code>
<code>80 right 90</code>
<code>90 forward 180</code>
<code>100 left 120</code>
<code>110 forward 50</code>
<code>120 left 60</code>
<code>130 forward 150</code>
<code>140 left 60</code>
<code>150 forward 50</code>
<code>160 left 120</code>
<code>170 forward 180</code>
<code>180 right 90</code>
<code>190 forward 100</code>
<code>200 penup</code>
<code>210 right 90</code>
<code>220 forward 20</code>
<code>230 fg "darkgrey"</code>
<code>240 pendown</code>
<code>250 right 90</code>
<code>260 forward 80</code>
<code>270 left 90</code>
<code>280 forward 50</code>
<code>290 left 90</code>
<code>300 forward 80</code>
<code>310 penup</code>
<code>320 backward 70</code>
<code>330 right 90</code>
<code>340 forward 20</code>
<code>350 fg "blue"</code>
<code>360 pendown</code>
<code>370 for i=1 to 4</code>
<code>380 forward 50</code>
<code>390 left 90</code>
<code>400 next</code>
<code>410 hide</code>
</pre>
</details>

---

Completed the course? Move onto the next one!

<a href="/courses/chatbot.md" class="card">Making an interactive chatbot 🢒</a>
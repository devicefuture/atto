[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Turtle graphics commands**

## `show`
```
show
```

Shows the turtle, to visually display the position and heading of the turtle. Mainly used to aid debugging or to graphically communicate the steps the turtle takes.

The turtle is shown by default. Use [`hide`](#hide) to hide the turtle.

<details>
<summary>Example</summary>
<pre>
<code>10 hide</code>
<code>20 for i=1 to 3</code>
<code>30 forward 50</code>
<code>40 left 60</code>
<code>50 next</code>
<code>60 show</code>
</pre>
</details>

## `hide`
```
hide
```

Hides the turtle, so as to not obscure the graphics drawn by the turtle.

## `forward`
```
forward distance
```

Moves the turtle forward in the current direction by the distance given as argument `distance`.

<details>
<summary>Example</summary>
<pre>
<code>10 forward 100</code>
<code>20 right 90</code>
<code>30 forward 100</code>
</pre>
</details>

## `backward`
```
backward distance
```

Moves the turtle backward in the current direction by the distance given as argument `distance`.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 6</code>
<code>20 forward 100</code>
<code>30 backward 100</code>
<code>40 right 60</code>
<code>50 next</code>
</pre>
</details>

## `left`
```
left amount
```

Turns the turtle left (anticlockwise) by the angle given as argument `amount`, in the current trigonometry mode.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 forward 10</code>
<code>30 left 10</code>
<code>40 next</code>
</pre>
</details>

## `right`
```
right amount
```

Turns the turtle right (clockwise) by the angle given as argument `amount`, in the current trigonometry mode.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 forward 10</code>
<code>30 right 10</code>
<code>40 next</code>
</pre>
</details>

## `penup`
```
penup
```

Stops the turtle from leaving a trail when it moves. Can be used to draw multiple objects on-screen without them being connected to each other.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 pendown</code>
<code>30 forward 5</code>
<code>40 penup</code>
<code>50 forward 5</code>
<code>60 next</code>
</pre>
</details>

## `pendown`
```
pendown
```

Makes the turtle leave a trail when it moves.

## `angle`
```
angle value
```

Sets the turtle to point in the angle given as argument `value`, clockwise from vertically upwards, in the current trigonometry mode.

<details>
<summary>Example</summary>
<pre>
<code>10 angle 45</code>
<code>20 forward 100</code>
</pre>
</details>
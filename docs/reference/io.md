[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **I/O and graphics commands**

## `print`
```
print message
```

Writes the text given as argument `message` to the current line on the display.

By default, `print` will add a newline onto the end of the written text, but adding the [`;`](/reference/operators.md#-4) operator to the end of the command will suppress this, allowing for multiple `print` commands to be used for writing one line.

<details>
<summary>Example</summary>
<pre>
<code>10 score=120</code>
<code>20 print "Your score is ";</code>
<code>30 print score</code>
<code>40 print "Well done!"</code>
</pre>
</details>

## `input`
```
input message, store
input store
```

Prompts the user with the text given as argument `message`, and stores the entered response into the variable given as argument `store`. If `message` is not present, then an empty input message will be shown.

<details>
<summary>Example</summary>
<pre>
<code>10 input "What's your name? ", name$</code>
<code>20 print "Hello, "; name$; "!"</code>
</pre>
</details>

## `cls`
```
cls
```

Clears the screen and positions the text cursor at the top left of the screen.

<details>
<summary>Example</summary>
<pre>
<code>10 cls</code>
<code>20 print "All cleared!"</code>
</pre>
</details>

## `pos`
```
pos colval, rowval
```

Positions the text cursor at the specified column and row cells, given as arguments `colval` and `rowval`, respectively.

Use the [`col`](/reference/constants.md#col) and [`row`](/reference/constants.md#row) constants to retrieve the current text cursor position.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=0 to 10</code>
<code>20 pos i, i</code>
<code>30 print "Hello, world!"</code>
<code>40 next</code>
</pre>
</details>

## `bg`
```
bg
bg colour
bg "rgb", red, green, blue
bg "rgb", red, green, blue, alpha
bg "hsl", hue, saturation, luminance
bg "hsl", hue, saturation, luminance, alpha
```

Sets the background colour for all future written text to be the given colour.

Set the first parameter to a colour name to set the background colour to that given colour; set the first parameter to `"rgb"` and set `red`, `green` and `blue` to set the background colour to a given RGB value (each component being within the range of `0`-`255`); or set the first parameter to `"hsl"` to set the background colour to a given HSL value (the `hue` value being a trigonometric angle, with `saturation` and `luminance` being within the range of `0`-`1`).

For `"rgb"` and `"hsl"`, a transparency value can be given as argument `alpha`, where `0` is completely transparent and `1` is completely opaque.

If no colour is chosen, then the default background colour for atto is used.

Use the [`cls`](#cls) command afterwards to fill the screen with the chosen background colour.

<details>
<summary>Example</summary>
<pre>
<code>10 bg "lightblue"</code>
<code>20 cls</code>
<code>30 print "This is a nice colour theme!"</code>
</pre>
</details>

## `fg`
```
fg
fg colour
fg "rgb", red, green, blue
fg "rgb", red, green, blue, alpha
fg "hsl", hue, saturation, luminance
fg "hsl", hue, saturation, luminance, alpha
```

Sets the foreground colour for all future written text to be the given colour.

Set the first parameter to a colour name to set the foreground colour to that given colour; set the first parameter to `"rgb"` and set `red`, `green` and `blue` to set the foreground colour to a given RGB value (each component being within the range of `0`-`255`); or set the first parameter to `"hsl"` to set the foreground colour to a given HSL value (the `hue` value being a trigonometric angle, with `saturation` and `luminance` being within the range of `0`-`1`).

For `"rgb"` and `"hsl"`, a transparency value can be given as argument `alpha`, where `0` is completely transparent and `1` is completely opaque.

If no colour is chosen, then the default foreground colour for atto is used.

The `fg` command also sets the trail colour of the graphical turtle, if in use.

<details>
<summary>Example</summary>
<pre>
<code>10 bg "red"</code>
<code>20 print "Something bad has happened!"</code>
</pre>
</details>

## `move`
```
move x, y
```

Positions the drawing brush at the specified location given as arguments `x` and `y`. The top left of the display is `0, 0`, and the bottom right is `639, 479`.

The `move` command also sets the position of the graphical turtle, if in use.

<details>
<summary>Example</summary>
<pre>
<code>10 move 100, 100</code>
<code>20 draw 100, 200</code>
<code>30 move 200, 100</code>
<code>40 draw 200, 200</code>
</pre>
</details>

## `draw`
```
draw x, y
```

Draws a line using the drawing brush from the old location to the new, specified location given as arguments `x` and `y`, using the foreground colour.

The `draw` command also sets the position of the graphical turtle, if in use.

<details>
<summary>Example</summary>
<pre>
<code>5 rem Draws a triangle</code>
<code>10 move 150, 100</code>
<code>20 draw 100, 200</code>
<code>30 draw 200, 200</code>
<code>40 draw 150, 100</code>
</pre>
</details>

## `plot`
```
plot x, y
```

Plots a point using the drawing brush at the specified location given as arguments `x` and `y`, using the foreground colour.

The `plot` command also sets the position of the graphical turtle, if in use.

## `stroke`
```
stroke width
```

Sets the drawing brush's stroke width, in pixels. The default value is `1`.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 stroke i</code>
<code>30 move 10, 10*i</code>
<code>40 draw 100, 100*i</code>
<code>50 next</code>
</pre>
</details>

## `fill`
```
fill
```

Fills in the polygon bound by the points given from the most recent `move` command and all subsequent `draw` commands using the foregrund colour.

<details>
<summary>Example</summary>
<pre>
<code>5 rem Draws a filled triangle</code>
<code>10 move 150, 100</code>
<code>20 draw 100, 200</code>
<code>30 draw 200, 200</code>
<code>40 fill</code>
</pre>
</details>

## `text`
```
text message, x, y
text message, x, y, size
```

Draws the text at the position specified by the arguments `x` and `y`, with the text specified as argument `message`, using the foreground colour.

If the `size` argument is present, then the text will be scaled by the scale factor specified as argument `size` from the normal text size.

The drawn text will not wrap to the next line if it reaches the edge of the screen.

<details>
<summary>Example</summary>
<pre>
<code>10 cls</code>
<code>20 for i=50 to 200 step 10</code>
<code>30 fg "rgb", 0, 0, 0, i/200</code>
<code>40 text i, i, "Hello, world!"</code>
<code>50 next</code>
</pre>
</details>

## `copy`
```
copy
```

Copies the current displayed frame to a hidden buffer used for rendering advanced graphics. The stored frame can then be restored by using the [`restore`](#restore) command.

The `copy` can be used to manipulate the rendering of the turtle, if in use.

<details>
<summary>Example</summary>
<pre>
<code>10 move 150, 100</code>
<code>20 draw 100, 200</code>
<code>30 draw 200, 200</code>
<code>40 draw 150, 100</code>
<code>50 copy</code>
<code>60 delay 500</code>
<code>70 fill</code>
<code>80 delay 500</code>
<code>90 restore</code>
<code>100 goto 50</code>
</pre>
</details>

## `restore`
```
restore
```

Restores the current displayed frame from a hidden buffer used for rendering advanced graphics. See [`copy`](#copy) for more details.

The `restore` can be used to manipulate the rendering of the turtle, if in use.

## `frame`
```
frame
```

Forces the display to be refreshed and rendered when called to aid in producing smooth animations.

<details>
<summary>Example</summary>
<pre>
<code>5 rem The background should only appear green</code>
<code>10 bg "red"</code>
<code>20 cls</code>
<code>30 bg "green"</code>
<code>40 cls</code>
<code>50 frame</code>
<code>60 goto 10</code>
</pre>
</details>

## `getpixel`
```
getpixel "rgb", x, y, red, green, blue
getpixel "hsl", x, y, hue, saturation, luminance
```

Gets the colour of the pixel at the position specified by arguments `x` and `y`. If the first argument is set to `"rgb"`, then the variables used for the `red`, `green` and `blue` arguments will be set to match the pixel's RGB value (each component being within the range of `0`-`255`). If the first argument is set to `"hsl"`, then the variables used for the `hue`, `saturation` and `luminance` arguments will be set to match the pixel's HSL value (the `hue` value being a trigonometric angle, with `saturation` and `luminance` being within the range of `0`-`1`).

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 bg "green"</code>
<code>30 cls</code>
<code>40 getpixel "hsl", 100, 100, hue, saturation, luminance</code>
<code>50 print "The colour at 100, 100 is:"</code>
<code>60 print hue; "° hue"</code>
<code>70 print saturation*100; "% saturation"</code>
<code>80 print luminance*100; "% luminance"</code>
</pre>
</details>
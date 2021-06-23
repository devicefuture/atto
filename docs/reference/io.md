[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **I/O and graphics commands**

## `print`
```
print message
```

Writes the text given as argument `message` to the current line on the display.

By default, `print` will add a newline onto the end of the written text, but adding the `;` operator to the end of the command will suppress this, allowing for multiple `print` commands to be used for writing one line.

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
```

Prompts the user with the text given as argument `message`, and stores the entered response into the variable given as argument `store`.

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

## `bg`
```
bg colour
bg "rgb", red, green, blue
bg "rgb", red, green, blue, alpha
bg "hsl", hue, saturation, luminance
bg "hsl", hue, saturation, luminance, alpha
```

Sets the background colour for all future written text to be the given colour.

Set the first parameter to a colour name to set the background colour to that given colour; set the first parameter to `"rgb"` and set `red`, `green` and `blue` to set the background colour to a given RGB value (each component being within the range of `0`-`255`); or set the first parameter to `"hsl"` to set the background colour to a given HSL value (the `hue` value being a trigonometric angle, with `saturation` and `luminance` being within the range of `0`-`1`).

For `"rgb"` and `"hsl"`, a transparency value can be given as argument `alpha`, where `0` is completely transparent and `1` is completely opaque.

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
fg colour
fg "rgb", red, green, blue
fg "rgb", red, green, blue, alpha
fg "hsl", hue, saturation, luminance
fg "hsl", hue, saturation, luminance, alpha
```

Sets the foreground colour for all future written text to be the given colour.

Set the first parameter to a colour name to set the foreground colour to that given colour; set the first parameter to `"rgb"` and set `red`, `green` and `blue` to set the foreground colour to a given RGB value (each component being within the range of `0`-`255`); or set the first parameter to `"hsl"` to set the foreground colour to a given HSL value (the `hue` value being a trigonometric angle, with `saturation` and `luminance` being within the range of `0`-`1`).

For `"rgb"` and `"hsl"`, a transparency value can be given as argument `alpha`, where `0` is completely transparent and `1` is completely opaque.

<details>
<summary>Example</summary>
<pre>
<code>10 bg "red"</code>
<code>20 print "Something bad has happened!"</code>
</pre>
</details>
[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Constants**

## `pi`
```
pi
```

Set to an approximate value of Pi (π), which is 3.1415926536.

<details>
<summary>Example</summary>
<pre>
<code>5 rem Prints the area of a circle</code>
<code>10 input "Enter radius: ", dist%</code>
<code>20 print pi*(dist%^2)</code>
</pre>
</details>

## `e`
```
e
```

Set to an approximate value of Euler's number (e), which is 2.7182818285.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 print i; ": "; e^i</code>
<code>30 next</code>
</pre>
</details>

## `phi`
```
phi
```

Set to an approximate value of the golden number (φ), which is 1.6180339887.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 print i; ": "; phi*i</code>
<code>30 next</code>
</pre>
</details>

## `epoch`
```
epoch
```

Set to the current number of milliseconds since midnight, 1 January 1970 (UNIX epoch timestamp).

<details>
<summary>Example</summary>
<pre>
<code>10 print "Current epoch: "; epoch</code>
<code>20 goto 10</code>
</pre>
</details>

## `random`
```
random
```

Set to a freshly-generated pseudorandom number within the bounds of [0, 1].

<details>
<summary>Example</summary>
<pre>
<code>10 roll = floor(random*6)+1</code>
<code>20 print "Your dice roll result is: ";</code>
<code>30 print roll</code>
</pre>
</details>

## `col`
```
col
```

Set to the current column position of the text cursor, in cell units. Can be manipulated by using [`pos`](/reference/io.md#pos).

<details>
<summary>Example</summary>
<pre>
<code>10 for i=0 to 10</code>
<code>20 print col; ",";</code>
<code>30 next</code>
</pre>
</details>

## `row`
```
row
```

Set to the current row position of the text cursor, in cell units. Can be manipulated by using [`pos`](/reference/io.md#pos).

<details>
<summary>Example</summary>
<pre>
<code>10 cls</code>
<code>20 for i=1 to 10</code>
<code>30 print row</code>
<code>40 next</code>
</pre>
</details>

## `key`
```
key
```

Set to the name of the current key being held down. If Shift is being pressed, then the key name will be in upper case.

Space is represented by `" "`, and Enter is represented by `"Enter"`. If no key is down, then the result will be `""`.

<details>
<summary>Example</summary>
<pre>
<code>10 print key</code>
<code>20 goto 10</code>
</pre>
</details>

## `heading`
```
heading
```

Set to the current heading angle of the turtle, clockwise from vertically upwards, in the current trigonometry mode.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 forward 20</code>
<code>30 right 10</code>
<code>40 next</code>
<code>50 print heading</code>
</pre>
</details>
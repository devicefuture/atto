[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Functions**

## `deg`
```
deg
```

Sets the current trigonometry mode to measure angles in degrees. One full sine wave should have a wavelength of 360°.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 print sin(90)</code>
</pre>
</details>

## `rad`
```
rad
```

Sets the current trigonometry mode to measure angles in radians. One full sine wave should have a wavelength of 2π rad.

<details>
<summary>Example</summary>
<pre>
<code>10 rad</code>
<code>20 print sin(pi/2)</code>
</pre>
</details>

## `gon`
```
gon
```

Sets the current trigonometry mode to measure angles in gradians. One full sine wave should have a wavelength of 400 gon.

<details>
<summary>Example</summary>
<pre>
<code>10 gon</code>
<code>20 print sin(100)</code>
</pre>
</details>

## `turn`
```
gon
```

Sets the current trigonometry mode to measure angles in revolutions. One full sine wave should have a wavelength of 1 turn.

<details>
<summary>Example</summary>
<pre>
<code>10 turn</code>
<code>20 print sin(1/4)</code>
</pre>
</details>

## `sin`
```
sin(x)
```

Calculates the sine of the numerical expression given as argument `x`, in the current trigonometry mode.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 for i=0 to 360</code>
<code>30 print sin(i)</code>
<code>40 next</code>
</pre>
</details>

## `cos`
```
cos(x)
```

Calculates the cosine of the numerical expression given as argument `x`, in the current trigonometry mode.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 for i=0 to 360</code>
<code>30 print cos(i)</code>
<code>40 next</code>
</pre>
</details>

## `tan`
```
tan(x)
```

Calculates the tangent of the numerical expression given as argument `x`, in the current trigonometry mode.

If `x` is equal to a multiple of 90, but not a multiple of 180, then an error will be raised since the result is ±∞.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 for i=0 to 360</code>
<code>30 if i mod 90=0 and i mod 180!=0</code>
<code>40 print "Infinity"</code>
<code>50 else</code>
<code>60 print tan(i)</code>
<code>70 end</code>
<code>80 next</code>
</pre>
</details>

## `asin`
```
asin(x)
```

Calculates the arcsine (inverse sine) of the numerical expression given as argument `x`, in the current trigonometry mode. The value of `x` must be in the range [-1, 1], otherwise an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 y=sin(10)</code>
<code>30 print asin(y)</code>
</pre>
</details>

## `acos`
```
acos(x)
```

Calculates the arccosine (inverse cosine) of the numerical expression given as argument `x`, in the current trigonometry mode. The value of `x` must be in the range [-1, 1], otherwise an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 y=cos(10)</code>
<code>30 print acos(y)</code>
</pre>
</details>

## `atan`
```
atan(x)
```

Calculates the arctangent (inverse tangent) of the numerical expression given as argument `x`, in the current trigonometry mode. The value of `x` must be in the range [-1, 1], otherwise an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 deg</code>
<code>20 y=tan(10)</code>
<code>30 print atan(y)</code>
</pre>
</details>

## `log`
```
log(x)
```

Calculates the base-10 logarithm of the numerical expression given as argument `x`. The value of `x` must be greater than 0, otherwise an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 print log(10000)</code>
</pre>
</details>

## `ln`
```
ln(x)
```

Calculates the natural logarithm of the numerical expression given as argument `x`. The value of `x` must be greater than 0, otherwise an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 print ln(e^4)</code>
</pre>
</details>

## `sqrt`
```
sqrt(x)
```

Calculates the square root of the numerical expression given as argument `x`. The value of `x` must be greater than 0, otherwise an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 print sqrt(2)</code>
</pre>
</details>

## `round`
```
round(x)
```

Rounds the numerical expression given as argument `x` to the nearest integer.

<details>
<summary>Example</summary>
<pre>
<code>10 print round(3.5)</code>
</pre>
</details>

## `floor`
```
floor(x)
```

Rounds the numerical expression given as argument `x` down to the nearest integer.

<details>
<summary>Example</summary>
<pre>
<code>10 print floor(3.7)</code>
</pre>
</details>

## `ceil`
```
ceil(x)
```

Rounds the numerical expression given as argument `x` up to the nearest integer.

<details>
<summary>Example</summary>
<pre>
<code>10 print floor(3.3)</code>
</pre>
</details>

## `abs`
```
abs(x)
```

Calculates the absolute value of the numerical expression given as argument `x`. Negative numbers will become positive, and positive numbers will remain positive.

<details>
<summary>Example</summary>
<pre>
<code>10 print abs(-4)</code>
</pre>
</details>

## `asc`
```
asc(x)
```

Finds the ASCII or Unicode codepoint of the first character of the string expression given as argument `x`.

<details>
<summary>Example</summary>
<pre>
<code>10 print asc("A")</code>
</pre>
</details>

## `chr$`
```
chr$(x)
```

Converts the ASCII or Unicode codepoint as the numerical expression given as argument `x` to a single-character string.

<details>
<summary>Example</summary>
<pre>
<code>10 print chr$(65)</code>
</pre>
</details>

## `bin`
```
bin(x)
```

Converts the binary (base-2) value of the string expression given as argument `x` to a number.

<details>
<summary>Example</summary>
<pre>
<code>10 print bin("1010")</code>
</pre>
</details>

## `oct`
```
bin(x)
```

Converts the octal (base-8) value of the string expression given as argument `x` to a number.

<details>
<summary>Example</summary>
<pre>
<code>10 print bin("462")</code>
</pre>
</details>

## `hex`
```
bin(x)
```

Converts the hexadecimal (base-16) value of the string expression given as argument `x` to a number.

<details>
<summary>Example</summary>
<pre>
<code>10 print hex("7a")</code>
</pre>
</details>

## `bin$`
```
bin$(x)
```

Converts the numerical expression given as argument `x` to a binary (base-2) string.

<details>
<summary>Example</summary>
<pre>
<code>10 print bin$(236)</code>
</pre>
</details>

## `oct$`
```
oct$(x)
```

Converts the numerical expression given as argument `x` to a octal (base-8) string.

<details>
<summary>Example</summary>
<pre>
<code>10 print oct$(236)</code>
</pre>
</details>

## `hex$`
```
hex$(x)
```

Converts the numerical expression given as argument `x` to a hexadecimal (base-16) string.

<details>
<summary>Example</summary>
<pre>
<code>10 print hex$(236)</code>
</pre>
</details>

## `len`
```
len(x)
```

Finds the character length of the string expression given as argument `x`, or the total count of the number of items in the list given as argument `x`.

<details>
<summary>Example</summary>
<pre>
<code>10 dim items</code>
<code>20 for i=1 to 10</code>
<code>30 push i, items</code>
<code>40 next</code>
<code>50 print len("Hello, world!")</code>
<code>60 print len(items)</code>
</pre>
</details>

## `last`
```
last(x)
```

Finds the last item in the list given as argument `x`. If `x` is empty, then an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 dim items</code>
<code>20 for i=1 to 10</code>
<code>30 push i*2, items</code>
<code>40 next</code>
<code>50 print last(items)</code>
</pre>
</details>

## `lower$`
```
lower$(x)
```

Converts the string expression given as argument `x` to a lower case string.

<details>
<summary>Example</summary>
<pre>
<code>10 print lower$("Hello, world!")</code>
</pre>
</details>

## `upper$`
```
upper$(x)
```

Converts the string expression given as argument `x` to an upper case string.

<details>
<summary>Example</summary>
<pre>
<code>10 print upper$("Hello, world!")</code>
</pre>
</details>

## `trim$`
```
trim$(x)
```

Removes leading and trailing whitespace characters on the string expression given as argument `x`.

<details>
<summary>Example</summary>
<pre>
<code>10 print trim$("   Hello, world!   "); "|End"</code>
</pre>
</details>

## `ltrim$`
```
ltrim$(x)
```

Removes leading whitespace characters on the string expression given as argument `x`.

<details>
<summary>Example</summary>
<pre>
<code>10 print ltrim$("   Hello, world!   "); "|End"</code>
</pre>
</details>

## `rtrim$`
```
rtrim$(x)
```

Removes trailing whitespace characters on the string expression given as argument `x`.

<details>
<summary>Example</summary>
<pre>
<code>10 print rtrim$("   Hello, world!   "); "|End"</code>
</pre>
</details>
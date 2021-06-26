[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Operators**

## `+`
```
a+b
```

Returns the result of adding `a` and `b` together.

<details>
<summary>Example</summary>
<pre>
<code>10 print 10+4</code>
</pre>
</details>

## `-`
```
a-b
```

Returns the result of subtracting `b` from `a`.

<details>
<summary>Example</summary>
<pre>
<code>10 print 7-3</code>
</pre>
</details>

## `*`
```
a*b
```

Returns the result of multiplying `a` and `b` together.

<details>
<summary>Example</summary>
<pre>
<code>10 print 5*3</code>
</pre>
</details>

## `/`
```
a/b
```

Returns the result of dividing `a` by `b`. If `b` is `0`, then an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 print 20/4</code>
</pre>
</details>

## `div`
```
a div b
```

Returns the result of integer division of `a` by `b`. If `b` is `0`, then an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 print 20 div 3</code>
</pre>
</details>

## `mod`
```
a mod b
```

Returns the result of modulo (the remainder of division) of `a` by `b`. If `b` is `0`, then an error will be raised.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Enter a number: ", number%</code>
<code>20 if number% mod 2=0</code>
<code>30 print "It's even"</code>
<code>40 else</code>
<code>50 print "It's odd"</code>
<code>60 end</code>
</pre>
</details>

## `;`
```
a;b
```

Returns the result of concatenating (joining) string `a` and string `b`.

If the operator is added to the end of a [`print`](/reference/io.md#print) command, then no newline will be added.

<details>
<summary>Example</summary>
<pre>
<code>10 input "How old are you?", age%</code>
<code>20 print "You're "; age%; " years old!"</code>
</pre>
</details>

## `&`
```
a&b
```

Returns the result of a bitwise AND of `a` and `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 result=bin("1100")&bin("0101")</code>
<code>20 print bin$(result)</code>
</pre>
</details>

## `|`
```
a|b
```

Returns the result of a bitwise OR of `a` and `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 result=bin("1100")|bin("0101")</code>
<code>20 print bin$(result)</code>
</pre>
</details>

## `~`
```
a~b
```

Returns the result of a bitwise exclusive OR (XOR) of `a` and `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 result=bin("1100")~bin("0101")</code>
<code>20 print bin$(result)</code>
</pre>
</details>

## `()`
```
(a)
```

Returns the evaluated result of `a`. Used to clarify expressions where operator precedence (eg. BIDMAS or BODMAS) would cause an incorrect evaluation.

```
10 print 5+3*2 # Prints 11
20 print (5+3)*2 # Prints 16
```
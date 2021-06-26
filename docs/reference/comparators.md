[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Comparators**

## `=`
```
a=b
```

Is true if the value of `a` is equal to the value of `b`.

If used outside of an [`if`](/reference/control.md#if) statement, then the value of `b` will be stored in variable `a`.

<details>
<summary>Example</summary>
<pre>
<code>10 input "What's your name? ", name$</code>
<code>20 if name$="James"</code>
<code>30 print "I know you!"</code>
<code>40 else</code>
<code>50 print "Nice to meet you, "; name$; "!"</code>
<code>60 end</code>
</pre>
</details>

## `<`
```
a<b
```

Is true if the value of `a` is less than but not equal to `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number: ", number%</code>
<code>20 if number%&lt;10</code>
<code>30 print "It's less than 10!"</code>
<code>40 else</code>
<code>50 print "It's not less than 10!"</code>
<code>60 end</code>
</pre>
</details>

## `<=`
```
a<=b
```

Is true if the value of `a` is less than or equal to `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number: ", number%</code>
<code>20 if number%&lt;=10</code>
<code>30 print "It's less than or equal to 10!"</code>
<code>40 else</code>
<code>50 print "It's not less than or equal to 10!"</code>
<code>60 end</code>
</pre>
</details>

## `>`
```
a>b
```

Is true if the value of `a` is greater than but not equal to `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number: ", number%</code>
<code>20 if number%&gt;10</code>
<code>30 print "It's greater than 10!"</code>
<code>40 else</code>
<code>50 print "It's not greater than 10!"</code>
<code>60 end</code>
</pre>
</details>

## `>=`
```
a>=b
```

Is true if the value of `a` is greater than or equal to `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number: ", number%</code>
<code>20 if number%&gt;=10</code>
<code>30 print "It's greater than or equal to 10!"</code>
<code>40 else</code>
<code>50 print "It's not greater than or equal to 10!"</code>
<code>60 end</code>
</pre>
</details>

## `!=`
```
a!=b
```

Is true if the value of `a` is not equal to `b`.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number that's not 10: ", number%</code>
<code>20 if number%!=10</code>
<code>30 print "Nice number!"</code>
<code>40 else</code>
<code>50 print "You didn't do as I said!"</code>
<code>60 end</code>
</pre>
</details>

## `and`
```
a and b
```

Is true if both the condition `a` and the condition `b` are true.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number between 1 and 10: ", number%</code>
<code>20 if number%&gt;=1 and number%&lt;=10</code>
<code>30 print "Nice number!"</code>
<code>40 else</code>
<code>50 print "It must be between 1 and 10!"</code>
<code>60 end</code>
</pre>
</details>

## `or`
```
a or b
```

Is true if either condition `a` or condition `b` is true, or both are true.

<details>
<summary>Example</summary>
<pre>
<code>10 input "What's your name? ", name$</code>
<code>20 if name$="Alice" or name$="Bob"</code>
<code>30 print "I know you!"</code>
<code>40 else</code>
<code>50 print "Nice to meet you, "; name$; "!"</code>
<code>60 end</code>
</pre>
</details>

## `xor`
```
a xor b
```

Is true only if either condition `a` or condition `b` is true, exclusively.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number that's either divisible by 3 or 5: ", number%</code>
<code>20 if number% mod 3=0 xor number% mod 5=0</code>
<code>30 print "Nice number!"</code>
<code>40 else</code>
<code>50 print "Not quite!"</code>
<code>60 end</code>
</pre>
</details>

## `not`
```
not a
```

Is true if condition `a` is not true.

<details>
<summary>Example</summary>
<pre>
<code>10 input "Think of a number that's not divisible by 2: ", number%</code>
<code>20 if not number% mod 2=0</code>
<code>30 print "Nice number!"</code>
<code>40 else</code>
<code>50 print "Not quite!"</code>
<code>60 end</code>
</pre>
</details>
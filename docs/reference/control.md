[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Control flow commands**

## `goto`
```
goto line
```

Jumps program execution to the line number given as argument `line`.

<details>
<summary>Example</summary>
<pre>
<code>5 rem Prints repeatedly until interrupted</code>
<code>10 print "Hello, world!"</code>
<code>20 goto 10</code>
</pre>
</details>

## `gosub`
```
gosub line
```

Branches program execution to the line number given as argument `line`, where execution will resume from the original line when `return` is called. This is used for creating subroutines, and `gosub` calls can be nested since returning line numbers are stored on a stack.

`return` must be used, otherwise the program execution will continue until the end of the program.

<details>
<summary>Example</summary>
<pre>
<code>10 diameter=5</code>
<code>20 gosub 100</code>
<code>30 print area</code>
<code>40 diameter=12</code>
<code>50 gosub 100</code>
<code>60 print area</code>
<code>70 end</code>
<code>100 print "The area of a circle of diameter "; diameter; " is: ";</code>
<code>110 area = pi*(diameter/2)^2</code>
<code>120 return</code>
</pre>
</details>
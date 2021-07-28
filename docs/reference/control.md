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
<code>20 gosub 80</code>
<code>30 print area</code>
<code>40 diameter=12</code>
<code>50 gosub 80</code>
<code>60 print area</code>
<code>70 stop</code>
<code>80 print "The area of a circle of diameter "; diameter; " is: ";</code>
<code>90 area = pi*(diameter/2)^2</code>
<code>100 return</code>
</pre>
</details>

## `return`
```
return
```

Returns from a subroutine called by `gosub`. See [`gosub`](#gosub) for more details.

## `if`
```
if condition
# statements if true
end
```

Executes the statements within the `if` statement if the condition given as argument `condition` is true. Otherwise, execution will be skipped to the `end` (or `else`, if present) line.

<details>
<summary>Example</summary>
<pre>
<code>10 input "What is your name? ", name$</code>
<code>20 if name$="James"</code>
<code>30 print "I know you!"</code>
<code>40 end</code>
</pre>
</details>

## `else`
```
if condition
# statements if true
else
# statements if false
end
```

Executes statements within the `else` statement if the last tested condition is false. Otherwise, execution will be skipped to the `end` line.

<details>
<summary>Example</summary>
<pre>
<code>10 input "5 + 7 = ? ", answer%</code>
<code>20 if answer%=12</code>
<code>30 print "Correct!"</code>
<code>40 else</code>
<code>50 print "Not quite!"</code>
<code>60 end</code>
</pre>
</details>

## `else if`
```
if condition1
# statements if condition1 is true
else if condition2
# statements if condition1 is false but condition2 is true
else
# statements if condition1 and condition2 are false
end
```

Executes statements within the `else if` statement if the last tested condition (`condition1`) is false and the condition given as argument `condition2` is true. Otherwise, execution will be skipped to the `end` (or `else`, if present) line.

<details>
<summary>Example</summary>
<pre>
<code>10 input "How old are you? ", age%</code>
<code>20 if age%&lt;13</code>
<code>30 print "You're a child!"</code>
<code>40 else if age%&lt;=19</code>
<code>50 print "You're a teenager!"</code>
<code>60 else</code>
<code>70 print "You're an adult!"</code>
<code>80 end</code>
</pre>
</details>

## `for`
```
for i=a to b
# statements to iterate over
next

for i=a to b step c
# statements to iterate over
next i
```

Assigns the value of `a` to the variable `i` and repeatedly executes statements within the `for` loop, incrementing `i` by `c` (or by `1`, if `c` is not present), up to and including the value of `b`.

The inclusion of the variable `i` after the `next` keyword is optional and has no symbolic meaning.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 8</code>
<code>20 print "2 to the power of "; i; " is "; 2^i</code>
<code>30 next</code>
</pre>
</details>

## `repeat`
```
repeat
# statements to loop over
loop

repeat
# statements to loop over
while condition

repeat
# statements to loop over
until condition
```

Executes statements within the loop once, and continues looping if the loop terminator results in a true condition.

<details>
<summary>Example</summary>
<pre>
<code>10 i=1</code>
<code>20 repeat</code>
<code>30 print "This value is "; 5*i</code>
<code>40 i=i+1</code>
<code>50 input "Type yes to continue: ", cont$</code>
<code>60 while cont$="yes"</code>
</pre>
</details>

## `while`
```
while condition
# statements to loop over
loop
```

Executes statements within the loop while the condition given as argument `condition` is true. If `condition` is false when the `while` loop is first approached, execution will be skipped to the `loop` line.

<details>
<summary>Example</summary>
<pre>
<code>10 while random>0.1</code>
<code>20 print "Rolling... "; round(random * 10)</code>
<code>30 delay 500</code>
<code>40 loop</code>
<code>50 print "Finished: "; round(random * 10)</code>
</pre>
</details>

## `until`
```
until condition
# statements to loop over
loop
```

Executes statements within the loop until the condition given as argument `condition` is true. If `condition` is true when the `until` loop is first approached, execution will be skipped to the `loop` line.

<details>
<summary>Example</summary>
<pre>
<code>10 sum=0</code>
<code>20 until sum>=100</code>
<code>30 input "Enter a number: ", value%</code>
<code>40 sum=sum+value%</code>
<code>50 loop</code>
<code>60 print "Your numbers add up to at least 100!"</code>
</pre>
</details>

## `break`
```
break
```

Skips execution to the next `next` or `loop` line, causing the loop to be stopped.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 input "Enter a number: ", value%</code>
<code>30 if value%=i</code>
<code>40 print "You guessed the same!"</code>
<code>50 break</code>
<code>60 end</code>
<code>70 next</code>
<code>80 print "Done!"</code>
</pre>
</details>

## `continue`
```
continue
```

Immediately returns to the opening line of the loop to continue execution from that point.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=1 to 10</code>
<code>20 if i mod 2=1</code>
<code>30 continue</code>
<code>40 end</code>
<code>50 print i; " is divisible by 2"</code>
<code>60 next</code>
</pre>
</details>

## `delay`
```
delay duration
```

Pauses program execution for a specified number of milliseconds given as argument `duration`, and then continues execution afterwards.

<details>
<summary>Example</summary>
<pre>
<code>10 count=0</code>
<code>20 print count</code>
<code>30 delay 1000</code>
<code>40 count=count+1</code>
<code>50 goto 20</code>
</pre>
</details>

## `stop`
```
stop
```

Halts the execution of the program.

<details>
<summary>Example</summary>
<pre>
<code>10 print "This line is reached"</code>
<code>20 stop</code>
<code>30 print "This line is never reached"</code>
</pre>
</details>

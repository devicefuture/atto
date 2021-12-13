[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **List commands and syntax**

## `[]`
```
items[index]
```

Returns the item at index given as argument `index` of the list given as argument `items`. If the item is not found, then the result will be `0`. The first item in the list will have the index `0`.

<details>
<summary>Example</summary>
<pre>
<code>10 dim items</code>
<code>20 for i=0 to 3</code>
<code>30 push i*2, items</code>
<code>40 next</code>
<code>50 print items[2]</code>
</pre>
</details>

## `dim`
```
dim listname
```

Creates a new, empty list which will be stored in the variable given as argument `listname`.

<details>
<summary>Example</summary>
<pre>
<code>10 dim items</code>
<code>20 print len(items) # Empty, so will be 0</code>
</pre>
</details>

## `push`
```
push item, items
```

Pushes the item given as argument `item` onto the end of the list given as argument `items`.

<details>
<summary>Example</summary>
<pre>
<code>10 dim alphabet</code>
<code>20 push "a", alphabet</code>
<code>30 push "b", alphabet</code>
<code>40 push "c", alphabet</code>
<code>50 print alphabet[1]</code>
</pre>
</details>

## `pop`
```
pop items
pop items, reassigned
```

Pops the last item from the list given as argument `items`, and if the `reassigned` variable is present, then it will be set to the value of the popped item.

<details>
<summary>Example</summary>
<pre>
<code>10 dim shopping</code>
<code>20 push "apple", shopping</code>
<code>30 push "banana", shopping</code>
<code>40 push "chocolate", shopping</code>
<code>50 pop shopping, bought</code>
<code>60 print "Bought "; bought</code>
</pre>
</details>

## `insert`
```
insert item, items, index
```

Inserts the item given as argument `item` into the list given as argument `items`, such that the inserted item will reside at index given as argument `index`. All items after that index will be shifted up so that they will continue to be in the list.

<details>
<summary>Example</summary>
<pre>
<code>10 dim shopping</code>
<code>20 push "apple", shopping</code>
<code>30 push "banana", shopping</code>
<code>40 push "chocolate", shopping</code>
<code>50 insert "pear", shopping, 1</code>
<code>60 print shopping</code>
</pre>
</details>

## `remove`
```
remove items, index
```

Removes the item at the index given as argument `index` from the list given as argument `items`. All items after that index will be shifted down to fill the empty space.

<details>
<summary>Example</summary>
<pre>
<code>10 dim shopping</code>
<code>20 push "apple", shopping</code>
<code>30 push "banana", shopping</code>
<code>40 push "chocolate", shopping</code>
<code>50 remove shopping, 1</code>
<code>60 print shopping</code>
</pre>
</details>

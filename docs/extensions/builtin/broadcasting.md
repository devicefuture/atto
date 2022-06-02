[Guide](/index.md) 🢒 [Extensions](/extensions/index.md) 🢒 **Broadcasting**

The Broadcasting extension lets atto programs running on two or more computers talk to each other over the internet. It can be used to make multiplayer games, chat programs, exciting multi-computer demos and more!

For broadcasting to work, one computer must be a **host** computer which generates a channel name. All other computers that want to connect to that computer must then **join** the host by using the generated channel name. All computers can then talk to each other once connected (messages from one computer are sent to all other computers).

To load the Broadcasting extension, run this command:

```
extload "broadcasting"
```

<details>
<summary>Example program (host computer)</summary>
<pre>
<code>10 extload "broadcasting"</code>
<code>20 broadcasting.host channel$</code>
<code>30 print "Channel name: "; channel$</code>
<code>40 input "Enter something to send: ", data</code>
<code>50 broadcasting.send data</code>
<code>60 broadcasting.receive data</code>
<code>70 if data!=0</code>
<code>80 print "Data received: "; data</code>
<code>90 end</code>
<code>100 goto 40</code>
</pre>
</details>

<details>
<summary>Example program (joining computer)</summary>
<pre>
<code>10 extload "broadcasting"</code>
<code>20 input "Channel name? ", channel$</code>
<code>30 broadcasting.join channel$</code>
<code>40 input "Enter something to send: ", data</code>
<code>50 broadcasting.send data</code>
<code>60 broadcasting.receive data</code>
<code>70 if data!=0</code>
<code>80 print "Data received: "; data</code>
<code>90 end</code>
<code>100 goto 40</code>
</pre>
</details>

## `broadcasting.host`
```
broadcasting.host channel$
```

Hosts a new broadcasting session, and stores the channel name in the variable given as argument `channel$`. This channel name can then be used on another computer to connect to the host.

## `broadcasting.join`
```
broadcasting.join channel$
```

Joins a broadcasting session being hosted on another computer, using the channel name given as argument `channel$`.

## `broadcasting.send`
```
broadcasting.send data
```

Broadcasts the data given as argument `data` to all other connected computers.

## `broadcasting.receive`
```
broadcasting.receive data
broadcasting.receive data timestamp
broadcasting.receive data timestamp ishost
```

Receives data from other connected computers and stores the data in the variable given as argument `data`. If there is no data to be received, the `data` variable will be set to `0`.

If a variable is given for the `timestamp` argument, its value will be set to the timestamp at which the data was sent (see [`epoch`](/reference/constants.md#epoch)).

If a variable is given for the `ishost` argument, its value will be set to `true` if the data was sent by the host computer, or `false` otherwise.
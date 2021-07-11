[Guide](/index.md) 🢒 [Command reference](/reference/index.md) 🢒 **Audio commands**

## `note`
```
note pitch, beats
```

Plays the note at the pitch given as argument `pitch`, for the beat length given as argument `beats`, and waits until the note has finished playing.

`pitch` can either be a string or a number. If it is a string, then it must specify a key on a musical keyboard, such as `"C4"` or `"A#5"`, where the letter represents the key in an octave, and the number represents the octave to play at. Middle C is `"C4"`.

If `pitch` is a number, then the number will determine the frequency to play the note at, in hertz.

<details>
<summary>Example</summary>
<pre>
<code>10 note "C4", 1</code>
<code>20 note "D4", 2</code>
<code>30 note "E4", 3</code>
<code>40 note "F4", 1</code>
</pre>
</details>

## `play`
```
play pitch, beats
```

Plays the note at the pitch given as argument `pitch`, for the beat length given as argument `beats`, withut waiting for the note to finish playing.

`play` can be used in conjunction with subsequent commands of itself or `note` commands to make a chord.

<details>
<summary>Example</summary>
<pre>
<code>10 play "A3", 1</code>
<code>20 play "C4", 1</code>
<code>30 play "E4", 1</code>
</pre>
</details>

## `rest`
```
rest beats
```

Rests for the beat length given as argument `beats`, and waits for the rest to finish.

<details>
<summary>Example</summary>
<pre>
<code>10 play "A3", 3</code>
<code>20 rest 1</code>
<code>30 play "C4", 2</code>
<code>40 rest 1</code>
<code>50 play "E4", 1</code>
</pre>
</details>

## `quiet`
```
quiet
```

Stops all audio from playing.

<details>
<summary>Example</summary>
<pre>
<code>10 play "C4", 10</code>
<code>20 delay 2000</code>
<code>30 quiet</code>
</pre>
</details>

## `bpm`
```
bpm
bpm value
```

Sets the beats per minute (BPM) to the value given as argument `value`. This controls the time at which the `note`, `play` and `rest` commands will last for. The value must be greater than 0.

If no value is chosen, then the BPM will be set to `120`.

<details>
<summary>Example</summary>
<pre>
<code>10 for i=300 to 1 step -10</code>
<code>20 bpm i</code>
<code>30 note "C4", 1</code>
<code>40 next</code>
</pre>
</details>

## `volume`
```
volume
volume value
```

Sets the volume level (within the range of `0`-`1`) to the value given as argument `value`.

If no value is chosen, then the volume will be set to `1` (or 100%).

<details>
<summary>Example</summary>
<pre>
<code>10 volume 0.5</code>
<code>20 play "C4", 1</code>
<code>10 volume</code>
<code>20 play "C4", 1</code>
</pre>
</details>

## `envelope`
```
envelope
envelope attack, decay, sustain, release
```

Sets the envelope waveform to determine the sound of notes. The attack of the envelope is given as argument `attack`, the decay as argument `decay`, the sustain as `sustain`, and release as `release`.

`sustain` will be bound in the range of `0`-`1`, and represents the proportion of the played note of which the note is sustained. `attack`, `decay` and `release` determine the timings of their respective proportions of the waveform, in milliseconds.

If no arguments are specified, then the default envelope values will be used.

<details>
<summary>Example</summary>
<pre>
<code>10 envelope 600, 200, 0.8, 800</code>
<code>20 play "C4", 1</code>
</pre>
</details>

## `speak`
```
speak message
```

Uses text-to-speech to audibly speak the message given as argument `message`, and does not wait for speech to finish.

<details>
<summary>Example</summary>
<pre>
<code>10 speak "Hello, world!"</code>
</pre>
</details>

## `voice`
```
voice
voice pitch, rate
```

Sets the text-to-speech voice to have a pitch given as argument `pitch`, and a rate given as argument `rate`, where `1` for both arguments represents a natural voice.

If no arguments are specified, then `1` will be used for both `pitch` and `rate`.

<details>
<summary>Example</summary>
<pre>
<code>10 voice 2, 1</code>
<code>20 speak "I speak with a high-pitched voice!"</code>
<code>30 delay 3000</code>
<code>40 voice 1, 2</code>
<code>50 speak "I speak really quickly!"</code>
</pre>
</details>
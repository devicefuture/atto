[Guide](/index.md) 🢒 [Extensions](/extensions/index.md) 🢒 **HTTP**

The HTTP extension lets atto talk to servers on the internet, and allows atto to fetch online data. It can be used to pull in data from online APIs to access news reports, weather information, random facts, Wikipedia articles and more!

> **Note:** The HTTP extension works with most http:// and https:// URLs, but some servers may not allow atto to connect to them due to security reasons.

To load the HTTP extension, run this command:

```
extload "http"
```

<details>
<summary>Example program</summary>
<pre>
<code>10 extload "http"</code>
<code>20 extload "json"</code>
<code>30 http.get "https://ipapi.co/json", data</code>
<code>50 json.parse data, "city", city$</code>
<code>60 print "We think you're in "; city$</code>
</pre>
</details>

## `http.isonline`
```
http.isonline online
```

Sets the variable given as argument `online` to `true` if the computer is connected to the internet, or `false` otherwise.

## `http.get`
```
http.get url, data
http.get url, data, status
```

Makes a GET request to the location given as argument `url` and stores the returned data in the variable given as argument `data`.

If a variable is given for the `status` argument, its value will be set to the HTTP status returned from the request (such as `200` or `404`).
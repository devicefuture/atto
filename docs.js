const TWITTER_MAX_CHAR_COUNT = 280;
const TWITTER_HANDLE = "@codeurdreams";

const REMOVED_ELEMENTS = ["script", "link", "style"];

var currentPage = null;
var oldTweet = null;

function visitDocumentation(path, updateUrl = true) {
    path = path.replace(/^docs\/\//g, "docs/");
    currentPage = path;

    var isExternalResource = path.startsWith("http://") || path.startsWith("https://");
    
    if (window.inDocsPopout && updateUrl) {
        window.history.pushState("", "", `${window.location.href.split("?")[0]}?page=${path}`);
    }

    fetch(path).then(function(response) {
        return response.text();
    }).then(function(data) {
        var converter = new showdown.Converter();
        var container = document.createElement("div");

        container.innerHTML = data;

        container.querySelectorAll(REMOVED_ELEMENTS.join(", ")).forEach((element) => element.remove());

        container.querySelectorAll("*").forEach(function(element) {
            if (element.matches(REMOVED_ELEMENTS.join(", "))) {
                element.remove();

                return;
            }

            [...element.attributes].forEach(function(attribute) {
                if (attribute.name.startsWith("on")) {
                    element.setAttribute(attribute.name, null);
                }
            });
        });

        document.querySelector("#docsContent").innerHTML = converter.makeHtml(container.innerHTML.replace(/&gt;/, ">"));

        document.querySelector("#docsContent").scrollTo(0, 0);

        document.querySelectorAll("a").forEach(function(element) {
            var destination = element.getAttribute("href") || "";

            if (destination.startsWith("http://") || destination.startsWith("https://") || destination.startsWith("./") || destination.startsWith("javascript:") || destination.startsWith("#")) {
                if (isExternalResource && (destination.startsWith("http://") || destination.startsWith("https://"))) {
                    element.setAttribute("target", "_blank");
                }

                if (isExternalResource && destination.startsWith("javascript:")) {
                    element.setAttribute("href", "javascript:void(0);");
                }

                return;
            }

            if (isExternalResource) {
                element.setAttribute("href", `javascript:void(0);`);

                element.addEventListener("click", function() {
                    visitDocumentation(new URL(".", path) + "/" + destination);
                });

                return;
            }

            element.setAttribute("href", `javascript:visitDocumentation("docs/${destination.replace(/^\//, "")}");`);
        });

        document.querySelectorAll("code").forEach(function(element) {
            var code = element.textContent;
        
            element.innerHTML = syntax.renderDocumentationSyntaxHighlighting(code);

            if (element.textContent != code) {
                element.textContent = code; // Fallback
            }
        });

        if (window.inDocsPopout) {
            document.querySelectorAll("details").forEach(function(element) {
                element.open = true;
            });

            if (window.location.hash == "") {
                window.scrollTo(0, 0);
            }
        }

        oldTweet = null;
    });
}

function popOutDocumentation(path = currentPage) {
    window.open(`docspopout.html?page=${path}`);
}

function toTweet(code, directHandle = true, inBase2048 = false) {
    var tweet = "";

    if (directHandle) {
        tweet += "@codeurdreams ";
    }

    if (inBase2048) {
        tweet += "🗜️ ";
    }

    tweet += code;

    return tweet;
}

function startTweetIntent() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(oldTweet)}&url=`, "_blank", "noopener");
}

window.addEventListener("load", function() {
    if (window.inDocsPopout) {
        return;
    }

    visitDocumentation("docs/index.md");

    setInterval(function() {
        var code = basic.programToText();
        var representedCode = code;
        var tweet = toTweet(representedCode, true);

        if (tweet.length > TWITTER_MAX_CHAR_COUNT) {
            representedCode = base2048.encode(new TextEncoder().encode(representedCode));
            tweet = toTweet(representedCode, true, true);
        }

        if (tweet != oldTweet) {
            document.querySelectorAll(".tweetableCode").forEach(function(element) {
                element.innerHTML = "";

                var handle = document.createElement("a");

                handle.href = "https://twitter.com/codeurdreams";
                handle.target = "_blank";
                handle.textContent = "@codeurdreams";

                element.append(handle);

                var code = document.createElement("span");

                code = tweet.replace(/^@codeurdreams /, " ");

                element.append(code);
            });

            document.querySelectorAll(".tweetableCodeSize").forEach(function(element) {
                element.textContent = tweet.length;
            });

            oldTweet = tweet;
        }
    }, 100);
});
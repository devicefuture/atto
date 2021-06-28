function visitDocumentation(path) {
    path = path.replace(/^docs\/\//g, "docs/");

    fetch(path).then(function(response) {
        return response.text();
    }).then(function(data) {
        var converter = new showdown.Converter();

        document.querySelector("#docs").innerHTML = converter.makeHtml(data);

        document.querySelectorAll("a").forEach(function(element) {
            var destination = element.getAttribute("href") || "";

            if (destination.startsWith("http://") || destination.startsWith("https://") || destination.startsWith("javascript:") || destination.startsWith("#")) {
                return;
            }

            element.setAttribute("href", `javascript:visitDocumentation("docs/${destination.replace(/\^\//, "")}");`);
        });

        document.querySelectorAll("code").forEach(function(element) {
            var code = element.textContent;
        
            element.innerHTML = syntax.renderDocumentationSyntaxHighlighting(code);

            if (element.textContent != code) {
                element.textContent = code; // Fallback
            }
        });
    });
}

window.addEventListener("load", function() {
    visitDocumentation("docs/index.md");
});
function visitDocumentation(path) {
    fetch(path).then(function(response) {
        return response.text();
    }).then(function(data) {
        var converter = new showdown.Converter();

        document.querySelector("#docs").innerHTML = converter.makeHtml(data);

        document.querySelectorAll("code").forEach(function(element) {
            element.innerHTML = syntax.renderDocumentationSyntaxHighlighting(element.textContent);
        });
    });
}

window.addEventListener("load", function() {
    visitDocumentation("docs/index.md");
});
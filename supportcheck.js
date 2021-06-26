try {
    new RegExp("(?<=test)test");
} catch (e) {
    window.location.replace("notsupported.html");
}
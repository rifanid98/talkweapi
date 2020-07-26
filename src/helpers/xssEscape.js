/**
 * XSS Attack Preventer
 */
String.prototype.escape = function () {
    var tagsToReplace = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&apos;",
        '"': "&quot;"
    };
    return this.replace(/[&<>\'\"]/g, function (tag) {
        return tagsToReplace[tag] || tag;
    });
};
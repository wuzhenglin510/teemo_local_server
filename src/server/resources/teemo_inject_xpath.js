function teemoGetElementXPath(element) {
    if (element && element.id)
        return '//*[@id="' + element.id + '"]';
    else
        return teemoGetElementTreeXPath(element);
}

function teemoGetElementTreeXPath(element) {
    var paths = [];
    for (; element && element.nodeType == 1; element = element.parentNode) {
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "["+(index + 1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/"): null;
}
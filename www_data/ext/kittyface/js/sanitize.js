/**
 * Sanitizer which filters a set of whitelisted tags, attributes and css.
 * For now, the whitelist is small but can be easily extended.
 *
 * @param bool whether to escape or strip undesirable content.
 * @param map of allowed tag-attribute-attribute-parsers.
 * @param array of allowed css elements.
 * @param array of allowed url scheme
 */
function HtmlWhitelistedSanitizer(escape, tags, css, urls) {
    this.escape = escape;
    this.allowedTags = tags;
    this.allowedCss = css;
    this.debug = false;

    // Use the browser to parse the input but create a new HTMLDocument.
    // This won't evaluate any potentially dangerous scripts since the element
    // isn't attached to the window's document. It also won't cause img.src to
    // preload images.
    //
    // To be extra cautious, you can dynamically create an iframe, pass the
    // input to the iframe and get back the sanitized string.
    this.doc = document.implementation.createHTMLDocument();

    if (typeof urls == "undefined") {
        urls = ['http://', 'https://'];
    }

    if (typeof this.allowedTags == "undefined") {
        // Configure small set of default tags
        var unconstrainted = function(x) { return x; };
        var globalAttributes = {
            'dir': unconstrainted,
            'lang': unconstrainted,
            'title': unconstrainted
        };
        var url_sanitizer = HtmlWhitelistedSanitizer.makeUrlSanitizer(urls);
        this.allowedTags = {
            'a': HtmlWhitelistedSanitizer.mergeMap(globalAttributes, {
                'download': unconstrainted,
                'href': url_sanitizer,
                'hreflang': unconstrainted,
                'ping': url_sanitizer,
                'rel': unconstrainted,
                'target': unconstrainted,
                'type': unconstrainted
            }),
            'img': HtmlWhitelistedSanitizer.mergeMap(globalAttributes, {
                'alt': unconstrainted,
                'height': unconstrainted,
                'src': url_sanitizer,
                'width': unconstrainted
            }),
            'p': globalAttributes,
            'div': globalAttributes,
            'span': globalAttributes,
            'br': globalAttributes,
            'b': globalAttributes,
            'i': globalAttributes,
            'u': globalAttributes
        };
    }
    if (typeof this.allowedCss == "undefined") {
        // Small set of default css properties
        this.allowedCss = ['border', 'margin', 'padding'];
    }
}

HtmlWhitelistedSanitizer.makeUrlSanitizer = function(allowed_urls) {
    return function(str) {
        if (!str) { return ''; }
        for (var i in allowed_urls) {
            if(this.debug) console.log(allowed_urls[i]);
            if (str.startsWith(allowed_urls[i])) {
                return str;
            }
        }
        return '';
    };
};

HtmlWhitelistedSanitizer.mergeMap = function( /*...*/ ) {
    var r = {};
    for (var arg in arguments) {
        for (var i in arguments[arg]) {
            r[i] = arguments[arg][i];
        }
    }
    return r;
};

HtmlWhitelistedSanitizer.prototype.sanitizeString = function(input) {
    var div = this.doc.createElement('div');
    div.innerHTML = input;

    // Return the sanitized version of the node.
    return this.sanitizeNode(div).innerHTML;
};

HtmlWhitelistedSanitizer.prototype.sanitizeNode = function(node) {
    // Note: <form> can have it's nodeName overriden by a child node. It's
    // not a big deal here, so we can punt on this.
    var node_name = node.nodeName.toLowerCase();
    if (node_name == '#text') {
        // text nodes are always safe
        return node;
    }
    if (node_name == '#comment') {
        // always strip comments
        return this.doc.createTextNode('');
    }
    if (!this.allowedTags.hasOwnProperty(node_name)) {
        // this node isn't allowed
        if(this.debug) console.log("forbidden node: " + node_name);
        if (this.escape) {
            return this.doc.createTextNode(node.outerHTML);
        }
        return this.doc.createTextNode('');
    }

    // create a new node
    var copy = this.doc.createElement(node_name);

    // copy the whitelist of attributes using the per-attribute sanitizer
    for (var n_attr = 0; n_attr < node.attributes.length; n_attr++) {
        var attr = node.attributes.item(n_attr).name;
        if (this.allowedTags[node_name].hasOwnProperty(attr)) {
            var sanitizer = this.allowedTags[node_name][attr];
            copy.setAttribute(attr, sanitizer(node.getAttribute(attr)));
        }
    }
    // copy the whitelist of css properties
    for (var css in this.allowedCss) {
        copy.style[this.allowedCss[css]] = node.style[this.allowedCss[css]];
    }

    // recursively sanitize child nodes
    while (node.childNodes.length > 0) {
        var child = node.removeChild(node.childNodes[0]);
        copy.appendChild(this.sanitizeNode(child));
    }
    return copy;
};

function runSanitizer(value) {
    var parser = new HtmlWhitelistedSanitizer(true);
    var sanitizedHtml = parser.sanitizeString(value);
    return sanitizedHtml;
}
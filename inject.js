
function base64(str) {
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Solution_1_%E2%80%93_escaping_the_string_before_encoding_it
    return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

module.exports = function(css, mount) {

    if (mount === true && window.btoa) {
        // inject as a data URI in <link> href for sourcemaps to work
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'data:text/css;base64,' + base64(css);

        document.getElementsByTagName('head')[0].appendChild(link);
    } else {
        var style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        mount = mount || document.getElementsByTagName('body')[0];
        mount.appendChild(style);
    }
};
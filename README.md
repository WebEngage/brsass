# brsass
Yet another Browserify transform for Sass

Just like [sassify](https://github.com/davidguttman/sassify), [scssify](https://github.com/chrishoage/scssify), [sassr](https://github.com/johnnybenson/sassr) and others, brsass enables one to directly `require()` .sass, .scss or .css files.  
Additionally brsass minifies the styles using [clean-css](https://github.com/jakubpawlowicz/clean-css) before they are included in the browserify bundle.

The bundled style modules only export the css and they must be manually injected into document `<style>` elements

### Install
```
npm install --save WebEngage/brsass
```

### Use
On the command line
```
$ browserify -t brsass entry.js > bundle.js
```

Or using the browserify API in your code
```js
var browserify = require('browserify');
var brsass = require('brsass');

var b = browserify(...);
b.transform(brsass);
```

#### License - [WTFPL](http://www.wtfpl.net/)
```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 WebEngage <geeks {at} webengage.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

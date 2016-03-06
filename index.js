var through = require('through2'),
    path = require('path'),
    sass = require('node-sass');

function type(value) {
    return Object.prototype.toString.call(value);
}

module.exports = function (file, options) {
    var ext = path.extname(file);

    if (ext !== '.scss' && ext !== '.sass' && ext !== '.css') {
        return through();
    }

    var chunks = [];

    return through(
        function (chunk, enc, next) {
            chunks.push(chunk);
            next()
        },
        function (done) {
            options = options || {};

            var source = Buffer.concat(chunks).toString('utf-8');
            var sassArguments = {
                file              : file,  // TODO - is this even necessary with source already available?
                data              : source,
                includePaths      : type(options.includePaths) === '[object Array]' ? options.includePaths.slice(0) : [],
                indentedSyntax    : ext === '.sass',
                outFile           : file,
                outputStyle       : 'nested',
                sourceComments    : false,
                sourceMap         : !!options.sourcemaps,
                sourceMapEmbed    : false,
                sourceMapContents : !!options.sourcemaps,
            };

            sassArguments.includePaths.unshift(path.dirname(file));


            function afterCompile(styles, callback) {
                if(type(options.afterCompile) === '[object Function]') {
                    return options.afterCompile(styles, callback);
                }

                var cleanOptions = {
                    keepSpecialComments: 0,
                    processImport: true,
                    processImportFrom: ['local']
                };

                if(options.sourcemaps) {
                    cleanOptions.sourceMap = styles.map.toString();
                    cleanOptions.sourceMapInlineSources = true;
                }

                var CleanCSS = require('clean-css');

                styles = (new CleanCSS(cleanOptions)).minify(styles.css.toString());

                if(options.sourcemaps) {
                    styles.styles  += '/*# sourceMappingURL=data:application/json;base64,'
                        + (new Buffer(JSON.stringify(styles.sourceMap))).toString('base64') + ' */';
                }

                callback(null, styles.styles);
            };

            var self = this;

            sass.render(sassArguments, function (err, styles) {
                if (err) {
                    return done(err);
                }

                afterCompile(styles, function (err, exports) {
                    if (err) {
                        return done(err);
                    }

                    self.push('module.exports = ' + JSON.stringify(exports) + ';');
                    done();
                });
            });
        }
    );
};
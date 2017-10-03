# inline-critical-css [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Stream that inlines critical CSS in HTML. Looks at the used CSS on a page and
only inlines the CSS that's used.

## Usage
```js
var inline = require('inline-critical-css')
var pump = require('pump')

var css = `
  .red { color: red }
`

var html = `
  <html>
    <head></head>
    <body class="red">Hello world</body>
  </html>
`

var stream = inline(css)
pump(stream, process.stdout)
stream.end(html)
```

## FAQ
### Why is this is a stream?
[hyperstream](https://github.com/substack/hyperstream) makes it easy to chain
HTML transforms together. I was too lazy to write my own parser + selector so
hence it being a stream. Also I use streams for this stuff anyway so it would
make a lot of sense to keep it as a stream.

### Why does it inline _all_ CSS used on a page?
Ideally we'd only inline the "above the fold" CSS, but that requires knowing
which tokens are "above the fold". This would require looking at a specific
viewport, and checking which tokens are used (e.g. headless chrome or similar).
We opted for a slightly simpler option, which hopefully works out well enough
for most cases.

### Why doesn't it inline my fancy selectors?
Inlining fancy selectors (e.g. `.foo:not(:first-child)`) is really hard to
determine statically if it's used. The best way to do so would be to launch a
headless chrome instance - but that requires a fair amount of compute
resources. So we don't. If you want that behavior, we recommend writing a
headless chrome module specifically for that (and let us know, we'd be
interested in that!)

## API
### `transformStream = inline(css)`
Create a transform stream that inlines critical CSS in HTML.

## See Also
- [substack/hyperstream](https://github.com/substack/hyperstream)
- [stackcss/extract-html-class](https://github.com/stackcss/extract-html-class)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/inline-critical-css.svg?style=flat-square
[3]: https://npmjs.org/package/inline-critical-css
[4]: https://img.shields.io/travis/stackcss/inline-critical-css/master.svg?style=flat-square
[5]: https://travis-ci.org/stackcss/inline-critical-css
[6]: https://img.shields.io/codecov/c/github/stackcss/inline-critical-css/master.svg?style=flat-square
[7]: https://codecov.io/github/stackcss/inline-critical-css
[8]: http://img.shields.io/npm/dm/inline-critical-css.svg?style=flat-square
[9]: https://npmjs.org/package/inline-critical-css
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard

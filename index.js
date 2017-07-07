var StringDecoder = require('string_decoder').StringDecoder
var extract = require('extract-html-class')
var eos = require('end-of-stream')
var through = require('through2')
var postcss = require('postcss')
var hs = require('hyperstream')
var assert = require('assert')

var filter = require('./lib/filter')

module.exports = inline

function inline (css) {
  assert.equal(typeof css, 'string', 'inline-critical-css: expected css to be type string')
  var decoder = new StringDecoder('utf8')
  var src = ''

  return through(write, flush)

  function write (chunk, _, cb) {
    src += decoder.write(chunk)
    cb()
  }

  function flush (cb) {
    src += decoder.end()

    var self = this
    var classes = extract(src)
    var opts = { rulesToKeep: classes }
    var critical = postcss(filter(opts)).process(css)

    critical = critical.css
    var style = '<style>' + critical + '</style>'

    var source = hs({
      head: { _appendHtml: style }
    })
    source.on('data', function (data) {
      self.push(data)
    })
    eos(source, function (err) {
      if (err) return cb(err)
    })
  }
}

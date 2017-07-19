var concat = require('concat-stream')
var pump = require('pump')
var tape = require('tape')

var inline = require('./')

tape('inlines critical css', function (assert) {
  assert.plan(2)
  var css = `
    .red { color: red }
  `

  var html = `
    <html>
      <head></head>
      <body class="red">Hello world</body>
    </html>
  `

  var expected = `
    <html>
      <head><style>.red{color:red;}</style></head>
      <body class="red">Hello world</body>
    </html>
  `

  var source = inline(css)
  var sink = concat({ encoding: 'string' }, function (str) {
    assert.equal(str, expected, 'was inlined')
  })

  pump(source, sink, function (err) {
    assert.ifError(err, 'no error pumping')
  })

  source.end(html)
})

tape('can parse nested selectors', function (assert) {
  assert.plan(2)
  var css = `
    .red > h1 { color: red }
  `

  var html = `
    <html>
      <head></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var expected = `
    <html>
      <head><style>.red>h1{color:red;}</style></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var source = inline(css)
  var sink = concat({ encoding: 'string' }, function (str) {
    assert.equal(str, expected, 'was inlined')
  })

  pump(source, sink, function (err) {
    assert.ifError(err, 'no error pumping')
  })

  source.end(html)
})

tape('can parse comments', function (assert) {
  assert.plan(2)
  var css = `
    /* foo */
    .red > h1 { color: red }
  `

  var html = `
    <html>
      <head></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var expected = `
    <html>
      <head><style>.red>h1{color:red;}</style></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var source = inline(css)
  var sink = concat({ encoding: 'string' }, function (str) {
    assert.equal(str, expected, 'was inlined')
  })

  pump(source, sink, function (err) {
    assert.ifError(err, 'no error pumping')
  })

  source.end(html)
})

tape('can parse breakpoints', function (assert) {
  assert.plan(2)
  var css = `
    @media screen {
      .red > h1 { color: red }
    }
    .red > h1 { color: blue }
  `

  var html = `
    <html>
      <head></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var expected = `
    <html>
      <head><style>@media screen{.red>h1{color:red;}}.red>h1{color:blue;}</style></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var source = inline(css)
  var sink = concat({ encoding: 'string' }, function (str) {
    assert.equal(str, expected, 'was inlined')
  })

  pump(source, sink, function (err) {
    assert.ifError(err, 'no error pumping')
  })

  source.end(html)
})

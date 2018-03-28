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

tape('can parse tag selectors', function (assert) {
  assert.plan(2)
  var css = `
    h1 { color: red }
  `

  var html = `
    <html>
      <head></head>
      <body><h1>Hello world</h1></body>
    </html>
  `

  var expected = `
    <html>
      <head><style>h1{color:red;}</style></head>
      <body><h1>Hello world</h1></body>
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

tape('excludes empty breakpoints', function (assert) {
  var css = `
    @media screen {
      .noop { color: red }
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
      <head><style>.red>h1{color:blue;}</style></head>
      <body class="red"><h1>Hello world</h1></body>
    </html>
  `

  var source = inline(css)
  var sink = concat({ encoding: 'string' }, function (str) {
    assert.equal(str, expected, 'was inlined')
    assert.end()
  })

  pump(source, sink, function (err) {
    assert.ifError(err, 'no error pumping')
  })

  source.end(html)
})

tape('can parse ids', function (assert) {
  assert.plan(2)
  var css = `
    #red { color: red }
  `

  var html = `
    <html>
      <head></head>
      <body id="red">Hello world</body>
    </html>
  `

  var expected = `
    <html>
      <head><style>#red{color:red;}</style></head>
      <body id="red">Hello world</body>
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

tape('ignores extra ids', function (assert) {
  assert.plan(2)
  var css = `
    #red { color: red }
  `

  var html = `
    <html>
      <head></head>
      <body id="blue red">Hello world</body>
    </html>
  `

  var expected = `
    <html>
      <head></head>
      <body id="blue red">Hello world</body>
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

tape('can parse * selector', function (assert) {
  assert.plan(2)
  var css = `
    * { box-sizing: border-box; }
  `

  var html = `
    <html>
      <head></head>
      <body>Hello world</body>
    </html>
  `

  var expected = `
    <html>
      <head><style>*{box-sizing:border-box;}</style></head>
      <body>Hello world</body>
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

tape('can parse multiple selectors', function (assert) {
  assert.plan(2)
  var css = `
    a, div, p, body, main { box-sizing: border-box; }
  `
  var html = `
    <html>
      <head></head>
      <body>
        <main>
          <p>Hello world</p>
        </main>
      </body>
    </html>
  `

  var expected = `
    <html>
      <head><style>a,div,p,body,main{box-sizing:border-box;}</style></head>
      <body>
        <main>
          <p>Hello world</p>
        </main>
      </body>
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

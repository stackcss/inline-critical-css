var stringify = require('css').stringify
var parse = require('css').parse

module.exports = filter

function filter (css, classes) {
  var tree = parse(css)
  var rules = tree.stylesheet.rules
  tree.stylesheet.rules = rules.filter(function (rule) {
    var selector = rule.selectors[0].match(/\.([\w\d-_]+)/)
    if (selector) selector = selector[1]
    return classes.indexOf(selector) !== -1
  })
  var str = stringify(tree)
  return str.replace(/\s/g, '') // remove all whitespace & newlines
}

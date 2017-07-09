var stringify = require('css').stringify
var parse = require('css').parse

module.exports = filter

function filter (css, classes) {
  var tree = parse(css)
  var rules = tree.stylesheet.rules
  tree.stylesheet.rules = rules.filter(function (rule) {
    var selector = rule.selectors.join(' ').replace(/^\./, '')
    return classes.indexOf(selector) !== -1
  })
  var str = stringify(tree)
  return str.replace(/\s/g, '') // remove all whitespace & newlines
}

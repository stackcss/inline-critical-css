var stringify = require('css').stringify
var parse = require('css').parse

module.exports = filter

function filter (css, classes) {
  var tree = parse(css)
  var rules = tree.stylesheet.rules
  tree.stylesheet.rules = rules.reduce(reduce, [])
  var str = stringify(tree)
  return str.replace(/[\n]+?[\s]*/g, '') // remove all whitespace & newlines
    .replace(/ *[>] */g, '>')
    .replace(/ *[:] */g, ':')
    .replace(/ *\}/g, '}')
    .replace(/ *\{/g, '{')

  function reduce (arr, rule) {
    if (rule.type === 'media') {
      rule.rules = rule.rules.reduce(reduce, [])
      arr.push(rule)
      return arr
    } else if (rule.type === 'rule') {
      var selector = rule.selectors[0].match(/\.([\w\d-_]+)/)
      if (selector) selector = selector[1]
      if (classes.indexOf(selector) !== -1) {
        arr.push(rule)
      }
    }
    return arr
  }
}

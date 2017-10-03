var stringify = require('css').stringify
var parse = require('css').parse

module.exports = filter

function filter (css, selectors) {
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
      if (rule.rules.length) arr.push(rule) // Don't push empty media queries
      return arr
    } else if (rule.type === 'rule') {
      rule.selectors.forEach(function (select) {
        var selector = select.match(/([.#]?[\w\d-_]+)/)
        if (selector) selector = selector[1]
        if (selector === '*') arr.push(rule)
        if (selectors.indexOf(selector) !== -1) {
          arr.push(rule)
        }
      })
    }
    return arr
  }
}

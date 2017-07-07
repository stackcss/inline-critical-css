// Adapted from https://github.com/asamiller/postcss-filter-classes

var postcss = require('postcss')

module.exports = filter

function filter (opts) {
  var filterClasses = postcss.plugin('filter-classes', handler)
  return filterClasses(opts)

  function handler (options) {
    return function (css) {
      var remregexes = regexize(options.rulesToKeep)
      var regex = concatRegexes(remregexes)

      css.walkRules(filterRule)

      function filterRule (rule) {
        var selectors = rule.selectors
        var filtered = []

        for (var j = 0, len = selectors.length; j < len; j++) {
          if (selectors[j].match(regex) !== null) {
            filtered.push(selectors[j])
          }
        }

        if (filtered.length > 1) {
          rule.selector = filtered.join(', ')
        } else if (filtered.length === 1) {
          rule.selector = filtered[0].trim()
        } else {
          rule.remove()
        }
      }
    }
  }
}

function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

function regexize (rulesToKeep) {
  var rulesRegexes = []
  for (var i = 0, l = rulesToKeep.length; i < l; i++) {
    if (typeof rulesToKeep[i] === 'string') {
      rulesRegexes.push(new RegExp('^\s*' + escapeRegExp(rulesToKeep[i]) + '\s*$'))
    } else {
      rulesRegexes.push(rulesToKeep[i])
    }
  }
  return rulesRegexes
}

function concatRegexes (regexes) {
  var rconcat = ''

  if (Array.isArray(regexes)) {
    for (var i = 0, l = regexes.length; i < l; i++) {
      rconcat += regexes[i].source + '|'
    }

    rconcat = rconcat.substr(0, rconcat.length - 1)

    return new RegExp(rconcat)
  }
}

'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/${template---name}.prod.cjs')
} else {
  module.exports = require('./dist/${template---name}.cjs')
}

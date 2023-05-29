// hbs helper
const Handlebars = require('handlebars')

Handlebars.registerHelper('is', (a, b, options) => { // is:helper 名稱 //a,b為可傳入變數
  if (a === b) {
    return options.fn(this) // handlebars內文字，出現在條件成立
  }
  return options.inverse(this) // handlebars內文字，出現條件不成立
})
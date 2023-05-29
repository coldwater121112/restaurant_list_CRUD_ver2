// require packages used in the project
const express = require('express')
const methodOverride = require('method-override');
const port = 3000
const exphbs = require('express-handlebars')
const handlebarsHelper = require('./config/handlebars-helper')
const app = express()
const routes = require('./routes')
require('./config/mongoose')

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
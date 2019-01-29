const express = require("express")
const bodyParser = require("body-parser")
const path = require('path')
const expressHbs = require('express-handlebars')


// ROUTER
const adminData = require('./routes/admin')
const shopRouter = require('./routes/shop')

const app = express()

app.engine()

// # GLOBAL APP CONFIGURATION
// app.engine('handlebars', expressHbs())
app.set('view engine', 'pug')
app.set('views', 'views')
// # END OF GLOBAL APP CONFIGURATION

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin',adminData.routes)

app.use('/shop',shopRouter)

app.get('/',shopRouter)

app.use((req, res, next) => {
    res.status(404).render('errors/404',{ pageTitle: "404"})
})

app.listen(3000)
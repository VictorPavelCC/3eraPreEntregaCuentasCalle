const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const path = require('path')
const handlebars = require('express-handlebars')
const sessionRouter = require('./routes/sessions.router')
const cartRouter = require("./routes/carts.router")
const productRouter = require("./routes/products.router")
const mockingRouter = require("./routes/mocks.router")
const errorHandler = require("./middleware/errors/errorHandler")
const passport = require('passport')
const logger = require ('./utils/logger')
const initializePassport = require('./config/passport.config')
const config = require("./config/config")


const app = express()
const PORT = 8080

app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, 'views'))
app.set("view engine", "handlebars")


app.listen(PORT, () => {
    logger.info(`Servidor is running on port ${PORT}`)
})


mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    logger.info("Connected to Mongo Atlas DB");
  })
.catch((error) => {
    logger.error(error);
  });

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 1000
    }),
    secret: config.privateKey,
    resave: false,
    saveUninitialized: false
}))


initializePassport();
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/sessions/", sessionRouter)
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);  
app.use("/api/mockingproducts", mockingRouter);
app.use(errorHandler);

/* app.use (adLogger)

app.get('/loggerTest', (req, res) => {
    req.logger.debug('debug')
    req.logger.http('http')
    req.logger.warning('warning')
    req.logger.error('error')
    res.send('Logger test')
  }) */
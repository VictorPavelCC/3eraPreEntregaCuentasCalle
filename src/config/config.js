const dotenv = require("dotenv")


dotenv.config()

const config = {
    mongoUrl: process.env.MONGO_URL,
    privateKey: process.env.SECRET_KEY
}

module.exports = config
const mongoose = require("mongoose")
require('dotenv').config()

const condb = async () => {
    await mongoose.connect(process.env.MONGO_URL)
     
}

module.exports = {condb}
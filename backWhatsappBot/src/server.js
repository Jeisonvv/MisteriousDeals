const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express()
const {router} = require('./routers/index')


app.use(morgan('dev'));
app.use(cors())
app.use(express.json())
app.use(router)

module.exports = app ;
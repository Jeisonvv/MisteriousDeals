const { Router } = require('express')
const {lunesRouter} = require('./lunesRouter')
const { MartesRouter } = require('./martesRouter')
const { MiercolesRouter } = require('./miercolesRouter')


const router = Router()

router.use('/Lunes', lunesRouter)
router.use('/Martes', MartesRouter)
router.use('/Miercoles', MiercolesRouter)



module.exports = {router}
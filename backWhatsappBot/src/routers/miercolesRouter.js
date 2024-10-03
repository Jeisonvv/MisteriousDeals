const { Router } = require('express')
const { dataMiercolesControllers, createMiercolesController, deleteAllMiercolesController} = require('../controllers/controllerMiercoles.js')



const MiercolesRouter = Router()
// esta para pedir todos los mensajes
MiercolesRouter.get('/', dataMiercolesControllers)


// para crear los mensajes
MiercolesRouter.post('/', createMiercolesController)

//eliminar lo que hay en la base de datos
MiercolesRouter.delete('/', deleteAllMiercolesController)

module.exports = {MiercolesRouter}

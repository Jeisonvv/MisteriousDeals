const { Router } = require('express')
const { dataMartesControllers, createMartesController, deleteAllMartesController} = require('../controllers/controllerMartes.js')



const MartesRouter = Router()
// esta para pedir todos los mensajes
MartesRouter.get('/', dataMartesControllers)


// para crear los mensajes
MartesRouter.post('/', createMartesController)

//eliminar lo que hay en la base de datos
MartesRouter.delete('/', deleteAllMartesController)

module.exports = {MartesRouter}

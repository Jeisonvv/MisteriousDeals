const { Router } = require('express')
const { dataLunesControllers, createLunesController, deleteAllLunesController} = require('../controllers/controllersLunes')



const lunesRouter = Router()
// esta para pedir todos los mensajes
lunesRouter.get('/', dataLunesControllers)


// para crear los mensajes
lunesRouter.post('/', createLunesController)

//eliminar lo que hay en la base de datos
lunesRouter.delete('/', deleteAllLunesController)

module.exports = {lunesRouter}

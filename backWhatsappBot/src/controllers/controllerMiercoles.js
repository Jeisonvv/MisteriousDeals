const { dataMiercoles, createMiercoles, deleteAllMiercoles } = require('../services/serviceMiercoles')
// este es el controlador de la data
const dataMiercolesControllers = async (req, res) => {
    
    try {
        const messages = await dataMiercoles();
        res.status(200).json(messages)
    } catch (error) {
        
        res.status(400).json({message: "hubo un error"})
    }
}
const createMiercolesController = async (req, res) => {
    try {
        // desestructuro lo que me llega de la req
        const {urlImg, description, regularPrice, exclusivePrice} = req.body;
        // un condicional que verifique que estan todos los datos 
        if(!urlImg || !description || !regularPrice || !exclusivePrice){
            return res.status(400).json({error: "faltan datos requeridos"})
        }

        // creo un nuevo mensaje
        const newMessage = await createMiercoles({urlImg, description, regularPrice, exclusivePrice})
        // Damos respuesta al cliente
        res.status(200).json(newMessage)


    } catch (error) {
        res.status(500).json({ error: "Error al crear la película", details: error.message });
    }
}
// Controlador para eliminar todos los mensajes en la colección 'Lunes'
const deleteAllMiercolesController = async (req, res) => {
    try {
        const result = await deleteAllMiercoles();

        // Si no hay documentos para eliminar
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "No hay mensajes para eliminar" });
        }

        // Respuesta exitosa
        res.status(200).json({ message: `Se eliminaron ${result.deletedCount} mensajes correctamente` });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar los mensajes", details: error.message });
    }
};




module.exports = {dataMiercolesControllers, createMiercolesController, deleteAllMiercolesController}
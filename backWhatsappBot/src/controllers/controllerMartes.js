const { dataMartes, createMartes, deleteAllMartes } = require('../services/serviceMartes')
// este es el controlador de la data
const dataMartesControllers = async (req, res) => {
    
    try {
        const messages = await dataMartes();
        res.status(200).json(messages)
    } catch (error) {
        
        res.status(400).json({message: "hubo un error"})
    }
}
const createMartesController = async (req, res) => {
    try {
        // desestructuro lo que me llega de la req
        const {urlImg, description, regularPrice, exclusivePrice} = req.body;
        // un condicional que verifique que estan todos los datos 
        if(!urlImg || !description || !regularPrice || !exclusivePrice){
            return res.status(400).json({error: "faltan datos requeridos"})
        }

        // creo un nuevo mensaje
        const newMessage = await createMartes({urlImg, description, regularPrice, exclusivePrice})
        // Damos respuesta al cliente
        res.status(200).json(newMessage)


    } catch (error) {
        res.status(500).json({ error: "Error al crear la película", details: error.message });
    }
}
// Controlador para eliminar todos los mensajes en la colección 'Lunes'
const deleteAllMartesController = async (req, res) => {
    try {
        const result = await deleteAllMartes();

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




module.exports = {dataMartesControllers, createMartesController, deleteAllMartesController}
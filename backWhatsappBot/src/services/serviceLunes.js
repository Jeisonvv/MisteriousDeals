const { Lune }= require('../model/lunes'); // Asegúrate de que la ruta sea correcta

// Función para obtener todos los documentos de la colección 'Lune'
const datalunes = async () => {
    try {
        const messages = await Lune.find(); // Buscar todos los documentos
        return messages; // Devolver los resultados
    } catch (error) {
        console.error('Error al obtener los documentos de Lune:', error);
        return []; // Devolver un array vacío si ocurre un error
    }
};

// Funcion para crear una pelicula
const createLunes = async (messages) => {
    try {
        const newMessage = await Lune.create(messages)
        return newMessage
    } catch (error) {
        console.error('Error creando la pelicula', error)
        throw error
    }
}
// Función para eliminar todos los documentos de la colección 'Lune'
const deleteAllLunes = async () => {
    try {
        const result = await Lune.deleteMany({}); // Eliminar todos los documentos
        console.log('Todos los documentos han sido eliminados');
        return result; // Retorna el resultado del proceso de eliminación
    } catch (error) {
        console.error('Error al eliminar los documentos de Lune:', error);
        throw error; // Lanza el error para manejarlo en otros lugares si es necesario
    }
};


module.exports = { datalunes, createLunes, deleteAllLunes };
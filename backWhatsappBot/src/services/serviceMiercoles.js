const { Miercole }= require('../model/lunes') // Asegúrate de que la ruta sea correcta

// Función para obtener todos los documentos de la colección 'Lune'
const dataMiercoles = async () => {
    try {
        const messages = await Miercole.find(); // Buscar todos los documentos
        return messages; // Devolver los resultados
    } catch (error) {
        console.error('Error al obtener los documentos de Lune:', error);
        return []; // Devolver un array vacío si ocurre un error
    }
};

// Funcion para crear una pelicula
const createMiercoles = async (messages) => {
    try {
        const newMessage = await Miercole.create(messages)
        return newMessage
    } catch (error) {
        console.error('Error creando la pelicula', error)
        throw error
    }
}
// Función para eliminar todos los documentos de la colección 'Lune'
const deleteAllMiercoles = async () => {
    try {
        const result = await Miercole.deleteMany({}); // Eliminar todos los documentos
        console.log('Todos los documentos han sido eliminados');
        return result; // Retorna el resultado del proceso de eliminación
    } catch (error) {
        console.error('Error al eliminar los documentos de Lune:', error);
        throw error; // Lanza el error para manejarlo en otros lugares si es necesario
    }
};


module.exports = { dataMiercoles, createMiercoles, deleteAllMiercoles };
const axios = require('axios');
// se inporta dotenv para traer el archivo .env los datos sencibles que no suban al repositorio
const dotenv = require('dotenv');
// Cargar variables de entorno desde el archivo .env
dotenv.config();

let messages = [];
const dia = "Miercoles"
const ip = process.env.IP
// Función asincrónica para realizar la solicitud
const solicitud = async () => {
    try {
        const response = await axios.get(`http://${ip}/${dia}`);
        messages = response.data;
    } catch (error) {
        console.error("No hay data", error);
    }
};

// Función principal para ejecutar la solicitud y luego exportar los mensajes
const init = async () => {
    await solicitud(); // Asegúrate de que esta llamada esté en una función async
};

// Llama a la función init para cargar los mensajes
init();

// Exporta la función para obtener los mensajes
module.exports = { getMessages: () => messages };

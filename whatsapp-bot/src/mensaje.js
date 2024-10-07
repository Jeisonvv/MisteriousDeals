const axios = require('axios');
const dotenv = require('dotenv');
const { getMessages } = require('./products/products');


const ip = process.env.IP


const array = async () =>{
    const mensaje = await getMessages()
    
    for (const message of mensaje) {
        try {

            // Desestructurar el objeto message
            const { urlImg, description, regularPrice, exclusivePrice, _id } = message;

            // Hacer la petición POST utilizando los datos desestructurados
            const response = await axios.post(`http://${ip}/allMessages`, {
                urlImg,
                description,
                regularPrice,
                exclusivePrice,
                idMessage: _id
            });

            console.log(`Mensaje creado correctamente: ${response.data}`);
        } catch (error) {
            console.error(`Error creando el mensaje con ID ${message.idMessage}:`, error);
        }
    }
    
}

array()



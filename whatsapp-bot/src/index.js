///importamos las objetos que se van a utilizar de whatsapp-web
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
//la libreria que genera el codigo 
const qrcode = require('qrcode-terminal');
// se inporta dotenv para traer el archivo .env los datos sencibles que no suban al repositorio
const dotenv = require('dotenv');
// esta es la funcion que pide los datosa a la base de datos 
const { getMessages } = require('./products/products'); // Asegúrate de que estás importando correctamente la función


// // Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia del cliente de WhatsApp con autenticación local
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento que se activa cuando se genera un código QR
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Evento que se activa cuando el cliente está listo
client.on('ready', async () => {
    console.log('Client is ready!');

    const groupId = process.env.ID_GRPOUP; // Reemplaza con tu ID de grupo
    let index = 0; // Índice para rastrear el mensaje actual
    let messages = await getMessages(); // Obtener los mensajes de la API

    // Función para enviar el mensaje con la imagen
    const sendMessage = async () => {
        if (index < messages.length) {
            const { description, urlImg, regularPrice, exclusivePrice, _id} = messages[index]; // Obtener el mensaje y la URL de la imagen del array
            try {
                // Crear un objeto MessageMedia desde la URL
                const media = await MessageMedia.fromUrl(urlImg);
                const descrip = await description.split('.').join('.\n')
                const precioR = await `Precio regular und: ~${regularPrice}~`
                const precioE = await `*¡Precio exclusivo und: ${exclusivePrice}*`
                const message = `${descrip}${precioR}\n${precioE}\n${_id}`

                // Enviar el mensaje con la imagen
                await client.sendMessage(groupId, media, { caption: message });
                console.log(`Mensaje ${index + 1} enviado`); // Index + 1 para mostrar el número correcto en la consola
            } catch (err) {
                console.error('Error al enviar el mensaje con imagen:', err);
            }
            index++; // Incrementar el índice para el siguiente mensaje

            // Cambiar el intervalo si el índice llega a 20
            if (index === 20) {
                clearInterval(intervalId); // Detener el intervalo anterior
                intervalId = setInterval(sendMessage, 7200000); // Cambiar el intervalo a 2 hora
                console.log("Intervalo cambiado a 1 hora después del mensaje 20");
            } else if (index === 21) { // Usar else if para el mensaje 21
                clearInterval(intervalId); // Detener el intervalo anterior
                intervalId = setInterval(sendMessage, 300000); // Volver al intervalo de 6 minutos
                console.log("Intervalo restablecido a 3 minutos después del mensaje 21");
            }
        } else {
            clearInterval(intervalId); // Detener el intervalo cuando se hayan enviado todos los mensajes
            console.log("Se enviaron todos los mensajes");
        }
    };

    // Enviar el primer mensaje inmediatamente
    sendMessage();

    // Configurar el intervalo para enviar un mensaje cada 6 minutos (180000 ms)
    let intervalId = setInterval(sendMessage, 360000); // Inicialmente cada 6 minutos
});

// Inicializar el cliente de WhatsApp
client.initialize();

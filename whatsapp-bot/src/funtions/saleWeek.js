const client = require("../clinet"); // el cliente de whatsapp
const readyEvent = require('../event/ready') //evento del cliente 
const dataSalesWeek = require('../modules/dataventa/dataweek/dataweeks'); // Obtener las compras
const sendWithIntervalWeek = require('../modules/dataventa/dataweek/intervalSendWeek'); // Módulo para enviar con intervalo


readyEvent(client) // aqui verificamos que el cliente este listo para trabar

const groupventa = '120363265917528751@g.us'; // ID del grupo de venta
const grupoTrabajo = '120363391658022985@g.us'; // ID del grupo de trabajo
const startDate = '2025-01-10'; // Fecha de las compras
const endDate = '2025-01-16'; // Fecha de las compras
const timezone = 'America/Bogota'; // Zona horaria

client.on('ready', async () => {
    try {
        const compras = await dataSalesWeek(client, groupventa, startDate, endDate, timezone);


        if (Array.isArray(compras) && compras.length > 0) {
            console.log(`Se encontraron ${compras.length} compradores. Enviando mensajes con intervalo...`);
            
            // Simular que el bot está escribiendo antes de enviar el mensaje
            await client.sendPresenceAvailable(); // Muestra al bot "en línea"

            // Enviar mensajes con intervalo
            await sendWithIntervalWeek(client, compras, grupoTrabajo, 5000, startDate, endDate);
            console.log("Mensajes enviados con éxito a todos los compradores.");
        } else {
            console.log("No se encontraron compras para enviar.");
        }
    } catch (error) {
        console.error("Error al obtener o enviar los mensajes:", error);
    }
});

client.initialize();

const client = require("../clinet"); // el cliente de whatsapp
const readyEvent = require('../event/ready') //evento del cliente 
const datasaletoday = require('../modules/dataventa/dataDia/dataDia'); // Obtener las compras
const sendWithInterval = require('../modules/dataventa/dataDia/intervarsed'); // Módulo para enviar con intervalo


readyEvent(client) // aqui verificamos que el cliente este listo para trabar

const groupventa = '120363265917528751@g.us'; // ID del grupo de venta
const grupoTrabajo = '120363322174878103@g.us'; // ID del grupo de trabajo
const date = '2025-01-07'; // Fecha de las compras
const timezone = 'America/Bogota'; // Zona horaria

client.on('ready', async () => {
    try {
        const compras = await datasaletoday(client, groupventa, date, timezone);

        if (Array.isArray(compras) && compras.length > 0) {
            console.log(`Se encontraron ${compras.length} compradores. Enviando mensajes con intervalo...`);
            
            // Enviar mensajes con intervalo
            await sendWithInterval(client, compras, grupoTrabajo, 5000, date);
            console.log("Mensajes enviados con éxito a todos los compradores.");
        } else {
            console.log("No se encontraron compras para enviar.");
        }
    } catch (error) {
        console.error("Error al obtener o enviar los mensajes:", error);
    }
});

client.initialize();

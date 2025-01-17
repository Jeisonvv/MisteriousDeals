const client = require('../clinet'); // Traemos el módulo del cliente
const readyEvent = require('../event/ready'); // Este es el módulo de si el cliente está listo

const dataSalesWeek = require('../modules/dataventa/dataweek/dataweeks'); // Este es el módulo de la data 
const intervalMessageReportShoping = require('../modules/dataventa/reportClient/intervalReportShoping');

readyEvent(client); // Aquí verificamos que el cliente esté listo para trabajar

const groupventa = '120363265917528751@g.us'; // ID del grupo de venta
const startDate = '2025-01-10'; // Fecha de las compras
const endDate = '2025-01-16'; // Fecha de las compras
const timezone = 'America/Bogota'; // Zona horaria

client.on('ready', async () => {
    try {
        const comprasClientes = await dataSalesWeek(client, groupventa, startDate, endDate, timezone) || [];

        if (Array.isArray(comprasClientes) && comprasClientes.length > 0) {
            console.log(`Se encontraron ${comprasClientes.length} compradores. Enviando mensajes con intervalo...`);

            // Enviar mensajes con intervalo
            await intervalMessageReportShoping(comprasClientes, client);
            console.log("Mensajes enviados con éxito a todos los compradores.");
        } else {
            console.log("No se encontraron compras para enviar.");
        }
    } catch (error) {
        console.error("Error al obtener o enviar los mensajes:", error);
    }
});

client.initialize();

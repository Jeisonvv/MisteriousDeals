const client = require('../../clinet'); //requierero el cliente 

// eventos 
const qrEvent = require('../../event/qr'); // esto permite generar el codigo qr en la terminal
const readyEvent = require('../../event/ready')

//registrar el evento
qrEvent(client);
readyEvent(client)

//inicializar el cliente
client.initialize();

//funcion 
client.on('ready', async () => {
    try {
        // Obtener todos los chats
        const chats = await client.getChats();

        // Filtrar solo los grupos
        const groups = chats.filter(chat => chat.id._serialized.endsWith('@g.us'));

        if (groups.length > 0) {
            // Mostrar los IDs de los grupos
            console.log('IDs de los grupos disponibles:');
            groups.forEach((group, index) => {
                console.log(`Grupo ${index + 1}: ${group.name} - ID: ${group.id._serialized}`);
            });
        } else {
            console.log('No se encontraron grupos.');
        }
    } catch (error) {
        console.error('Error al obtener los IDs de los grupos:', error);
    }
})


const client = require('../clinet');
const listenForReactions = require('../modules/dataventa/confirmationOfSale');

client.on('ready', () => {
    console.log('Cliente listo para escuchar reacciones.');
});

client.on('message_reaction', async (reaction) => {
    try {
        const groupId = '120363265917528751@g.us'; // ID del grupo de ventas
        const groupBomo = '120363391658022985@g.us' // grupo de la agencia 

        // Verifica si la reacción es del grupo correcto y si es la reacción ✅
        if (reaction.id.remote === groupId && reaction.reaction === '✅') {
            // Obtener el número del participante que reaccionó
            const senderPhoneNumber = reaction.senderId.split('@')[0];

            // Obtener el número del participante que escribió el mensaje original (el que recibió la reacción)
            const originalSenderPhoneNumber = reaction.msgId.participant.split('@')[0];

            // Verificar si el mensaje es una respuesta a otro mensaje
            const message = await client.getMessageById(reaction.msgId._serialized);

            // Inicializar las variables fuera del bloque condicional
            let title = '';
            let precio = '';

            if (message.hasQuotedMsg) {
                // Obtener el mensaje citado
                const quotedMessage = await message.getQuotedMessage();
                const parts = quotedMessage.body;
                const regex = /^(.*?)(?:,|\s*\$|\s*$|:|–|_|#|\-)/;
                const matchTitle = parts.match(regex);
                const matchPrecio = parts.match(/\$\s?(\d+(\.\d{3})*)/);

                if (matchTitle) {
                    title = matchTitle[1].trim();
                }

                if (matchPrecio) {
                    precio = matchPrecio[1].trim();
                }
            } else {
                console.log('El mensaje no es una respuesta a otro mensaje.');
            }

            // Enviar mensaje al participante que escribió el mensaje original
            const confirmationMessage = `✨ ¡Compra confirmada! ✨\n\n${title}\n\n📦 ¡Gracias por tu compra! 🙌\nℹ️ Para más información, contáctanos. 📱\n*BOMO SHOPING*\n👉 3124131990 👈`;
            // Mesnaje para el grupo
            const confirmationVenta = `🛒 *Venta de producto*\n\n${title}\n\n📱 *Clinte:* ${originalSenderPhoneNumber}\n🔑 *Confirmado por*: ${senderPhoneNumber}`;

            if (originalSenderPhoneNumber) {
                await client.sendMessage(originalSenderPhoneNumber + '@c.us', confirmationMessage); // Enviar mensaje al participante que escribió el mensaje original
                console.log(`Mensaje enviado a ${originalSenderPhoneNumber}: ${confirmationMessage}`);
            }

            // Enviar el mensaje al grupo
            if (groupId) {
                await client.sendMessage(groupBomo, confirmationVenta); // Enviar mensaje al grupo
                console.log(`Mensaje enviado al grupo ${groupId}: ${confirmationVenta}`);
            }

        }
    } catch (error) {
        console.error('Error al manejar la reacción:', error);
    }
});

client.initialize();

const listenForReactions = async (client, groupId) => {
    client.on('message', async (msg) => {
        // Escucha todos los mensajes
        try {
            const chat = await msg.getChat();

            // Solo escuchar mensajes en el grupo específico
            if (chat.id._serialized === groupId) {
                console.log(`Mensaje detectado en el grupo ${groupId}`);

                // Escucha reacciones en el mensaje
                msg.on('reaction', async (reaction) => {
                    console.log(`Reacción detectada: ${reaction.reaction}`);

                    // Verifica si la reacción es ✅
                    if (reaction.reaction === '✅') {
                        console.log(`Reacción ✅ detectada en el mensaje con ID: ${reaction.id.id}`);

                        // Obtén el autor del mensaje reaccionado
                        const originalMessage = await reaction.getMessage();
                        const authorId = originalMessage?.author || originalMessage?.from;

                        if (authorId) {
                            // Envía un mensaje al autor
                            const responseMessage = `Hola 👋, vimos que reaccionaste con ✅. ¡Gracias por avisarnos!`;
                            await client.sendMessage(authorId, responseMessage);
                            console.log(`Mensaje enviado al autor: ${authorId}`);
                        } else {
                            console.error('No se pudo obtener el autor del mensaje reaccionado.');
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error al procesar mensaje:', error);
        }
    });
};

module.exports = listenForReactions;

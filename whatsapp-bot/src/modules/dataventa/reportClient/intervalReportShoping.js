const generateMessageReportShoping = require('./sendMessageReportbuys');

const intervalMessageReportShoping = async (compras, client) => {
    try {
        // Define el intervalo entre mensajes (en milisegundos)
        const interval = 30000; // 30 segundos

        // Calcular el total de todas las compras
        const totalVenta = compras.reduce((total, buyer) => {
            // Sumar los precios de todos los productos de cada comprador
            const totalCompra = buyer.productos.reduce((sum, product) => sum + product.precio, 0);
            buyer.totalCompra = totalCompra; // Añadir el total al comprador
            return total + totalCompra;
        }, 0);

        // Iterar sobre cada comprador
        for (const buyer of compras) {
            try {
                // Asegurarse de que el comprador tiene el formato correcto
                const buyerId = buyer.comprador.includes('@') ? buyer.comprador : `${buyer.comprador}@c.us`;

                // Generar mensaje personalizado con el total del comprador
                const totalProductos = buyer.totalCompra || 0; // Total de productos comprados por el comprador
                const message = `${generateMessageReportShoping(buyer) || 'Información no disponible'}\n\n💰 *Total*: $${totalProductos}`;

                const messageFinal = `BOMOSHOPPING te recuerda que en el transcurso del *SABADO* se te entregarán los productos.\n🚚 Los pagos son contra entrega en Nequi, Daviplata y efectivo.\n 💳 pagos por transferencia 3124131990 💵\nEl envío tiene un costo de *5 mil pesos*. 📦\n\n¡Que tengas un excelente día! 😊`

                // Simular una pausa antes de enviar el mensaje
                const typingDelay = Math.random() * (3000 - 1000) + 1000; // Retraso aleatorio entre 1 y 3 segundos
                await new Promise(resolve => setTimeout(resolve, typingDelay));

                // Enviar mensaje al comprador
                await client.sendMessage(buyerId, message); // Usar buyerId que tiene el formato correcto
                await client.sendMessage(buyerId, messageFinal)
                console.log(`Mensaje enviado al comprador: ${buyerId}`);
            } catch (error) {
                console.error(`Error al enviar mensaje al comprador ${buyer.comprador}:`, error);
            }

            // Pausa entre mensajes
            await new Promise(resolve => setTimeout(resolve, interval));
        }

        console.log(`Total de ventas procesadas: $${totalVenta}`);
    } catch (error) {
        console.error('Error en intervalMessageReportShoping:', error);
    }
};

module.exports = intervalMessageReportShoping;

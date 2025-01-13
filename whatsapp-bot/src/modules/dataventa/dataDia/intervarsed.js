const generateMessage = require('./sendmessage');

const sendWithInterval = async (client, compras, grupoTrabajo, interval, date) => {
    try {
        // Calcular el total de todas las compras
        const totalVenta = compras.reduce((total, buyer) => {
            // Sumar los precios de todos los productos de cada comprador
            const totalCompra = buyer.productos.reduce((sum, product) => sum + product.precio, 0);
            buyer.totalCompra = totalCompra;  // Añadir el total al comprador
            return total + totalCompra;
        }, 0);

        // Mensaje inicial
        const mensajeInicial = `🛍️ *Iniciando el reportes de venta del día ${date}* 🛍️\n\nSe encontraron *${compras.length} compradores*. Por favor, espere mientras se procesan los mensajes.`;
        await client.sendMessage(grupoTrabajo, mensajeInicial);
        console.log("Mensaje inicial enviado correctamente.");
        let index = 0
        // Enviar mensajes individuales con intervalo
        for (const buyer of compras) {
            try {
                index++
                // Generar mensaje personalizado con el total del comprador
                const totalProductos = buyer.totalCompra || 0; // Total de productos comprados por el comprador

                const message = `*Comprador ${index}:* ${generateMessage(buyer)}\n\n💰 *Total del comprador*: $${totalProductos}`;
                
                // Enviar mensaje al grupo
                await client.sendMessage(grupoTrabajo, message);
                console.log(`Mensaje enviado al comprador: ${buyer.comprador}`);
            } catch (error) {
                console.error(`Error al enviar mensaje al comprador ${buyer.comprador}:`, error);
            }

            // Pausa entre mensajes
            await new Promise(resolve => setTimeout(resolve, interval));
        }

        // Mensaje final con el total de la venta
        const mensajeFinal = `✅ *Fin del envío de reportes.*\n\n💰 *Total de la venta del día*: $${totalVenta}`;
        await client.sendMessage(grupoTrabajo, mensajeFinal);
        console.log("Mensaje final enviado correctamente.");
    } catch (error) {
        console.error("Error durante el envío de mensajes con intervalo:", error);
    }
};

module.exports = sendWithInterval;

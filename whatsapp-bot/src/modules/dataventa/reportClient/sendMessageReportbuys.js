// este es el formato para enviar el mensaje del cliente
const generateMessageReportShoping = (buyer) => {
    
    let message = `*👋 ¡Hola! 😊 Estos son los productos que compraste esta semana:*:\n`;

    buyer.productos.forEach((product, index) => {
        message += `\n*Producto ${index + 1}:*\n`;
        message += `  - *Nombre*: ${product.producto}\n`;
        message += `  - *Precio*: $${product.precio}\n`;
    });

    message += `Gracias por tu compra. ¡Que disfrutes de tus productos! 🎉`
    return message;
};

module.exports = generateMessageReportShoping;

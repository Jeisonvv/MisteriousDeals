const generateMessage = (buyer) => {
    let message = `${buyer.comprador}\n\n`;
    message += `*Productos comprados*:\n`;

    buyer.productos.forEach((product, index) => {
        message += `\n*Producto ${index + 1}:*\n`;
        message += `  - *Nombre*: ${product.producto}\n`;
        message += `  - *Precio*: $${product.precio}\n`;
        message += `  - *Fecha*: ${product.fechaMensaje}\n`;
        message += `  - *Hora*: ${product.horaMensaje}\n`;
    });

    return message;
};

module.exports = generateMessage;

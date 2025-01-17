const moment = require('moment-timezone');

// Función para obtener el historial de mensajes de un grupo en un rango de días
const dataSalesWeek = async (client, groupId, startDate, endDate, timezone) => {
    const compras = [];

    try {
        const chat = await client.getChatById(groupId);
        const messages = await chat.fetchMessages({ limit: 25000 });

        // Filtrar los mensajes por rango de fechas, respuestas y reacciones
        const filteredMessages = await Promise.all(
            messages.map(async (msg) => {
                if (isValidMessage(msg, startDate, endDate, timezone)) {
                    const reactions = await msg.getReactions();
                    const filteredReactions = reactions.filter(
                        (reaction) => reaction.aggregateEmoji === '✅'
                    );
                    return filteredReactions.length > 0 ? msg : null;
                }
                return null;
            })
        ).then((results) => results.filter((msg) => msg !== null));

        // Procesar cada mensaje filtrado
        for (const msg of filteredMessages) {
            const newCompra = await processMessage(msg, timezone);
            if (newCompra) {
                compras.push(newCompra);
            }
        }

        // Agrupar compras por comprador
        const groupedByBuyer = compras.reduce((acc, item) => {
            if (!acc[item.comprador]) {
                acc[item.comprador] = {
                    comprador: item.comprador,
                    productos: []
                };
            }
            acc[item.comprador].productos.push({
                producto: item.producto,
                precio: item.precio,
                idProducto: item.idProducto,
                fechaMensaje: item.fechaMensaje,
                horaMensaje: item.horaMensaje
            });
            return acc;
        }, {});

        // Convertir el objeto acumulador en un array
        const resultArray = Object.values(groupedByBuyer);

        return resultArray; // Devolver el array agrupado
    } catch (error) {
        console.error(`Error al obtener mensajes del grupo: ${error.message}`);
        return [];
    }
};

// Validar si el mensaje está dentro del rango de fechas, es una respuesta y tiene reacciones
const isValidMessage = (msg, startDate, endDate, timezone) => {
    const msgDate = moment.unix(msg.timestamp).tz(timezone);
    const startOfRange = moment(startDate).tz(timezone).startOf('day');
    const endOfRange = moment(endDate).tz(timezone).endOf('day');

    // Verificar si la fecha del mensaje está dentro del rango
    const isWithinDateRange =
        msgDate.isSameOrAfter(startOfRange) && msgDate.isSameOrBefore(endOfRange);
    const isReply = msg.hasQuotedMsg; // Revisa si el mensaje tiene una respuesta
    const hasReactions = msg.hasReaction; // Revisa si el mensaje tiene reacciones

    return isWithinDateRange && isReply && hasReactions;
};

// Procesar cada mensaje, extrayendo la información relevante
const processMessage = async (msg, timezone) => {
    // Extraer la fecha y hora del mensaje
    const msgDateFormatted = moment.unix(msg.timestamp).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    const msgDateOnly = moment.unix(msg.timestamp).tz(timezone).format('YYYY-MM-DD');
    const msgHourFormatted = moment.unix(msg.timestamp).tz(timezone).format('HH:mm');

    let quotedMessageContent = 'No hay mensaje citado';

    if (msg.hasQuotedMsg) {
        const quotedMessage = await msg.getQuotedMessage();
        quotedMessageContent = quotedMessage ? quotedMessage.body : 'No hay mensaje citado';
    }

    if (quotedMessageContent !== 'No hay mensaje citado') {
        const parts = quotedMessageContent;
        const regex = /^(.*?)(?:,|\s*\$|\s*$|:|–|_|#|\-)/;
        const match = parts.match(regex);

        if (match && match[1]) {
            const title = match[1].trim();
            const exclusivePrice = formatPrice(extractExclusivePrice(quotedMessageContent));
            const lastPart = quotedMessageContent.split(' ').pop();
            const comprador = msg.author || msg.from;
            const buyerNumber = comprador.replace(/.*?(\d+)@.*/, '$1');

            return {
                comprador: buyerNumber,
                producto: title,
                precio: exclusivePrice,
                idProducto: lastPart,
                fechaMensaje: msgDateOnly,
                horaMensaje: msgHourFormatted
            };
        } else {
            return null;
        }
    }

    return null;
};

// Extraer el precio exclusivo del mensaje citado
const extractExclusivePrice = (quotedMessageContent) => {
    const priceMatch = quotedMessageContent.match(/\$\s?([\d.,]+)/);
    if (!priceMatch) {
        return 'No disponible';
    }
    return priceMatch[1].replace(/[.,](?=\d{3})/g, ''); // Quita separadores de miles
};

// Formatear el precio quitando puntos y convirtiendo a número
const formatPrice = (priceString) => {
    if (priceString === 'No disponible') {
        return 0;
    }

    const normalizedPrice = priceString.replace('.', '').replace(',', '.');
    return parseFloat(normalizedPrice);
};

module.exports = dataSalesWeek;

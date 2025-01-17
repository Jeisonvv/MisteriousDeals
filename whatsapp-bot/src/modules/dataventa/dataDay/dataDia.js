const moment = require('moment-timezone');

// Función para obtener el historial de mensajes de un grupo en un solo día
const dataSalesToday = async (client, groupId, date, timezone) => {
    const compras = [];
    
    try {
        const chat = await client.getChatById(groupId);
        const messages = await chat.fetchMessages({ limit: 10000 });

        // Filtrar los mensajes por fecha, respuestas y reacciones
        const filteredMessages = await Promise.all(
            messages.map(async (msg) => {
                if (isValidMessage(msg, date, timezone)) {
                    const reactions = await msg.getReactions();
                    const filteredReactions = reactions.filter(reaction => reaction.aggregateEmoji === '✅');
                    return filteredReactions.length > 0 ? msg : null;
                }
                return null;
            })
        ).then(results => results.filter(msg => msg !== null));

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

// Validar si el mensaje es dentro de la fecha, es una respuesta y tiene reacciones
const isValidMessage = (msg, date, timezone) => {
    const msgDate = moment.unix(msg.timestamp).tz(timezone);
    const startOfDay = moment(date).tz(timezone).startOf('day');
    const endOfDay = moment(date).tz(timezone).endOf('day');

    // Usar isSameOrAfter y isSameOrBefore para incluir el rango completo
    const isWithinDateRange = msgDate.isSameOrAfter(startOfDay) && msgDate.isSameOrBefore(endOfDay);
    const isReply = msg.hasQuotedMsg; // revisa si el mensaje tiene una respuesta
    const hasReactions = msg.hasReaction; // revisa si el mensaje tine reacciones

    return isWithinDateRange && isReply && hasReactions;
};

// Procesar cada mensaje, extrayendo la información relevante
const processMessage = async (msg, timezone) => {
    // Extraer la fecha y hora del mensaje
    const msgDateFormatted = moment.unix(msg.timestamp).tz(timezone).format('YYYY-MM-DD HH:mm:ss');

    // Extraer solo la fecha (YYYY-MM-DD)
    const msgDateOnly = moment.unix(msg.timestamp).tz(timezone).format('YYYY-MM-DD');
    
    // Extraer solo la hora del mensaje (HH:mm:ss)
    const msgHourFormatted = moment.unix(msg.timestamp).tz(timezone).format('HH:mm:ss');

    let quotedMessageContent = 'No hay mensaje citado';

    if (msg.hasQuotedMsg) {
        const quotedMessage = await msg.getQuotedMessage();
        quotedMessageContent = quotedMessage ? quotedMessage.body : 'No hay mensaje citado';
    }

    if (quotedMessageContent !== 'No hay mensaje citado') {
        const parts = quotedMessageContent;
        const regex = /^(.*?)(?:,|\s*\$|\s*$|:|–|_|#|\-)/; // Expresión regular
        const match = parts.match(regex);  // Usar .match() para obtener el resultado
        
        // Verificar si la expresión regular encontró una coincidencia
        if (match && match[1]) {
            const title = match[1].trim();
            const exclusivePrice = formatPrice(extractExclusivePrice(quotedMessageContent));
            const lastPart = parts[parts.length - 1]; // Última parte (ID o referencia)

            const comprador = msg.author || msg.from;
            const buyerNumber = comprador.replace(/.*?(\d{12})@.*/, '$1');

            // Devolver el objeto con la información del producto y la imagen (si existe)
            return {
                comprador: buyerNumber,
                producto: title,
                precio: exclusivePrice,
                idProducto: lastPart,
                fechaMensaje: msgDateOnly,  // Fecha del mensaje en formato YYYY-MM-DD
                horaMensaje: msgHourFormatted,  // Hora del mensaje en formato HH:mm:ss
            };
        } else {
            
            return null;
        }
    }

    return null;
};

// Extraer el precio exclusivo del mensaje citado
const extractExclusivePrice = (quotedMessageContent) => {
    const priceMatch = quotedMessageContent.match(/\$\s?(\d+(\.\d{3})*)/);
    return priceMatch ? priceMatch[1] : 'No disponible';
};

// Formatear el precio quitando puntos y convirtiendo a número
const formatPrice = (priceString) => {
    if (priceString === 'No disponible') {
        return 0;
    }

    // Quitar puntos y convertir a número
    const normalizedPrice = priceString.replace('.', '').replace(',', '.'); // Por si hay separadores de miles o decimales
    return parseFloat(normalizedPrice); // Convertir a número
};

module.exports = dataSalesToday;

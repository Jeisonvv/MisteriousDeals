const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sessions', // Ruta donde se guardará la sesión
    }),
    puppeteer: {
        headless: true, // Cambiar a false si deseas ver el navegador en ejecución
    },
});

module.exports = client;

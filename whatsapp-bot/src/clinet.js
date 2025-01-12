const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Cambiar a false si deseas ver el navegador en ejecución
    },
});

module.exports = client;

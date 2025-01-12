const qrcode = require('qrcode-terminal');

module.exports = (client) => {
    client.on('qr', (qr) => {
        console.log('Parece que no hay una sesión guardada. Escanea este código QR para iniciar sesión:');
        qrcode.generate(qr, { small: true });
    });
};

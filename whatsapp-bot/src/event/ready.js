module.exports = (client) => {
    client.on('ready', () => {
        console.log('El cliente está listo y la sesión ha sido restaurada.');
    });
};

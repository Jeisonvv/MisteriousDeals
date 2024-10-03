const { condb } = require('./src/config/condb');
const app = require('./src/server');




const port = 3002;
const host = '192.168.1.89';

// Asegúrate de usar el router aquí

condb().then((res) => {
    app.listen(port, host, ()=>{
        console.log(`esperando peticiones por el puerto ${port}`)
        
    })
})

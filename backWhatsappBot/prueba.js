const mongoose = require("mongoose");
const { Lune } = require("./src/model/lunes"); // Ajusta la ruta al archivo de tu esquema
require("dotenv").config();

const condb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conectado a MongoDB");

        // Crear una instancia del modelo
        const nuevoLune = new Lune({
            url: "http://example.com/producto",
            description: "esta es la decripcion que coloque",
            precioRegular: 100,
            precioExclusivo: 80
        });

        // Guardar el documento
        const resultado = await nuevoLune.save();
        console.log("Documento guardado:", resultado);
    } catch (error) {
        console.error("Error al conectar o guardar en MongoDB:", error);
    }
};

condb();

condb().then((res) => {
    app.listen(port,()=>{
        console.log(`esperando peticiones por el puerto ${port}`)
    })
})
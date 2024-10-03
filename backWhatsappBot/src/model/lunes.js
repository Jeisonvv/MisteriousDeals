const mongoose = require('mongoose');

const lunesSchema = new mongoose.Schema({
    urlImg: String,
    description: String,
    regularPrice: String,
    exclusivePrice: String
});

const Lune = mongoose.model('Lunes', lunesSchema);
const Marte = mongoose.model('Martes', lunesSchema);
const Miercole = mongoose.model('Miercoles', lunesSchema);
const Jueve = mongoose.model('Jueves', lunesSchema);
const Vierne = mongoose.model('Viernes', lunesSchema);

module.exports = {Lune, Marte, Miercole, Jueve, Vierne};


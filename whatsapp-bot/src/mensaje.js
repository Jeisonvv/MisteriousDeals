const description = "🛠️ Kit de Lijas de Pulido.✨ Ideal para obtener un acabado suave y profesional.🌟 Perfecto para proyectos de carpintería y manualidades."
const precioR = "10.000"
const precioE = '5.000'
const preciorms = `¡Precio exclusivo und: ~${precioR}~`
const PrecioEms = `*Precio regular und: ${precioE}*`
const descrip = description.split(".").join('.\n')
const mensaje = `${descrip}${PrecioEms}\n${preciorms}`
console.log(mensaje)


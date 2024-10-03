import axios from 'axios';
import './App.css';
import React, { useState } from 'react';

function App() {
  // Inicializamos el estado del formulario con useState
  const [formData, setFormData] = useState({
    urlImg: '',
    description: '',
    regularPrice: '',
    exclusivePrice: '',
    dia: '',
  });

  // Estado adicional para el mensaje de éxito/error
  const [message, setMessage] = useState('');

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validar que todos los campos estén completos
  const validateForm = () => {
    const { urlImg, description, regularPrice, exclusivePrice, dia } = formData;
    return urlImg && description && regularPrice && exclusivePrice && dia;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // Si no está validado, mostramos un mensaje de error
    if (!validateForm()) {
      setMessage('Por favor, diligencia todos los campos.');
      clearMessageAfterTimeout(); // Llamamos a la función para borrar el mensaje después de unos segundos
      return;
    }
    

    try {
      const { dia, ...dataToSend } = formData;
      const response = await axios.post(`http://192.168.1.89:3002/${formData.dia}`, dataToSend);

      // Verificar si el status es 200 y mostrar mensaje de éxito
      if (response.status === 200) {
        setMessage('Mensaje creado correctamente.');
        // Limpiar los campos del formulario
        setFormData({
          urlImg: '',
          description: '',
          regularPrice: '',
          exclusivePrice: '',
          dia: '',
        });
      }
    } catch (error) {
      console.error('Error creando mensaje:', error);
      setMessage('Hubo un error creando el mensaje.');
    }

    clearMessageAfterTimeout(); // Llamamos a la función para borrar el mensaje después de unos segundos
  };

  // Función para limpiar el mensaje después de unos segundos
  const clearMessageAfterTimeout = () => {
    setTimeout(() => {
      setMessage(''); // Borramos el mensaje
    }, 3000); // 3000 ms = 3 segundos
  };

  return (
    <div className='conctainer-form'>
      <h1 className='title'>MISTERIOUS DEALS</h1>
      {/* Mostrar mensaje de éxito o error */}
      {message && <p className='message'>{message}</p>}
      <div>
        <div className='conteiner-img'>
          {/* Mostrar la imagen si la URL es válida */}
          {formData.urlImg && <img src={formData.urlImg} alt="Imagen de la URL" style={{ width: '300px', height: 'auto' }} />}
        </div>
        <form onSubmit={handleSubmit} className='form'>
          <input className='form-input' type="text" name="urlImg" value={formData.urlImg} onChange={handleChange} placeholder="URL de la imagen" />
          <input className='form-input' type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" />
          <input className='form-input' type="text" name="regularPrice" value={formData.regularPrice} onChange={handleChange} placeholder="Precio Regular" />
          <input className='form-input' type="text" name="exclusivePrice" value={formData.exclusivePrice} onChange={handleChange} placeholder="Precio Exclusivo" />
          <input className='form-input'
            list='dias' 
            name="dia" 
            value={formData.dia} 
            onChange={handleChange} 
            placeholder="Día" 
          />
          <datalist id='dias'>
            <option value='Lunes' />
            <option value='Martes' />
            <option value='Miercoles' />
            <option value='Jueves' />
            <option value='Viernes' />
          </datalist>
          <button className='boton' type="submit">Crear Mensaje</button>
        </form>
      </div>
    </div>
  );
}

export default App;


import { db } from '../db.js'

//Crear USUARIO
export const CrearUsuario =  (req, res) => {
  const { nombre, apellido, altura, edad, peso_inicial } = req.body;

  const insertQuery = 'INSERT INTO Usuarios (nombre, apellido, altura, edad, peso_inicial) VALUES (?, ?, ?, ?, ?)';
  const values = [nombre, apellido, altura, edad, peso_inicial];

  db.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error('Error al insertar el usuario:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const nuevoUsuarioId = results.insertId;
    res.status(201).json({ id: nuevoUsuarioId, mensaje: 'Usuario ingresado exitosamente' });
  });
};




// Endpoint para obtener un usuario por ID
export const ObtenerUsuarioID = (req, res) => {
    const userId = req.params.id;
  
    // Consulta SQL para obtener el usuario por ID
    const sql = 'SELECT * FROM Usuarios WHERE id_usuario = ?';
  
    // Ejecutar la consulta
    db.query(sql, [userId], (err, result) => {
      if (err) {
        throw err;
      }
      
      if (result.length > 0) {
        res.json(result[0]); // Devuelve el primer usuario encontrado (debería ser único por ID)
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    });
  };


  // Endpoint para obtener lista de usuarios
  export const ListaUsuarios = (req, res) => {
    // Consulta SQL para obtener todos los usuarios
    const sql = 'SELECT * FROM Usuarios';
  
    // Ejecutar la consulta
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta: ' + error.message);
        res.status(500).send('Error interno del servidor');
        return;
      }
  
      // Enviar la lista de usuarios como respuesta
      res.json(results);
    });
  };
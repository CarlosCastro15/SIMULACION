
import { db } from '../db.js'
import  util from 'util'


//Crear USUARIO
// Ruta para crear un usuario
export const CrearUsuario = (req, res) => {
  const { nombre, apellido, edad } = req.body;

  // Insertar el nuevo usuario en la base de datos
  db.query(
    'INSERT INTO Usuarios (nombre, apellido, edad) VALUES (?, ?, ?)',
    [nombre, apellido, edad],
    (err, result) => {
      if (err) {
        console.error('Error al insertar usuario: ' + err.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      // Enviar una respuesta exitosa
      res.status(201).json({ id: result.insertId, mensaje: 'Usuario creado exitosamente' });
    }
  );
};





// Endpoint para obtener el historial por ID de usuario
export const ObtenerUsuarioID = (req, res) => {
  const id_usuario = req.params.id_usuario;

  // Consulta SQL para obtener el historial según el ID de usuario
  const query = `
    SELECT * FROM Historial_ICM
    WHERE id_usuario = ?
  `;

  // Ejecutar la consulta
  db.query(query, [id_usuario], (error, results) => {
    if (error) {
      console.error('Error al obtener el historial: ', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(results);
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


// Utilizar promisify para convertir funciones de callback en promesas
const query = util.promisify(db.query).bind(db);


// Función para calcular el nuevo peso_actual e IMC
const calcularNuevoPesoIMC = async (id_usuario, altura, semanas, peso_actual) => {
  // Obtener el último registro de Historial_ICM para el usuario
  const getLastRecordQuery = 'SELECT peso_actual, imc FROM Historial_ICM WHERE id_usuario = ? ORDER BY id_historial DESC LIMIT 1';
  const lastRecord = await query(getLastRecordQuery, [id_usuario]);

  // Calcular tasa de pérdida de peso aleatoria entre 0.0100 y 0.0400
  const tasa_perdida_peso = Math.random() * (0.0400 - 0.0100) + 0.0100;

  // Utilizar el peso_actual y el IMC de la fila anterior
  const peso_anterior = lastRecord.length > 0 ? lastRecord[0].peso_actual : peso_actual;
  const imc_anterior = lastRecord.length > 0 ? lastRecord[0].imc : peso_actual / (altura * altura);

  // Actualizar peso_actual según la condición IMC > 25
  const nuevo_peso_actual = imc_anterior >= 25 ? peso_anterior - tasa_perdida_peso * peso_anterior : peso_anterior;

  // Calcular el nuevo IMC utilizando el nuevo peso_actual
  const nuevo_imc = nuevo_peso_actual / (altura * altura);

  return { nuevo_imc, nuevo_peso_actual };
};

// Endpoint para iniciar el cálculo
 export const CalcularICM = async (req, res) => {
  const { id_usuario, altura, semanas, peso_actual } = req.body;

  try {
    let nuevo_imc = 0;
    let nuevo_peso_actual = peso_actual;
    let semana = 1;

    do {
      const result = await calcularNuevoPesoIMC(id_usuario, altura, semana, nuevo_peso_actual);
      nuevo_imc = result.nuevo_imc;
      nuevo_peso_actual = result.nuevo_peso_actual;

      // Insertar el nuevo registro en la tabla Historial_ICM
      const sql = 'INSERT INTO Historial_ICM (id_usuario, altura, semanas, peso_actual, imc) VALUES (?, ?, ?, ?, ?)';
      const values = [id_usuario, altura, semana, nuevo_peso_actual, nuevo_imc];
      await query(sql, values);

      semana++;

      if (nuevo_imc < 25) {
        // Si el IMC es menor que 25, enviar mensaje de logro y salir del bucle
        res.status(200).json({ message: 'Cálculo completado. ¡Logrado!' });
        return;
      }
    } while (true);

    // Esto se ejecutará solo si el bucle no se detiene con el mensaje de logro
    res.status(200).json({ message: 'Cálculo completado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
};


// Endpoint para eliminar un usuario por ID
export const EliminarUsuario = (req, res) => {
  const userId = req.params.id;

  const deleteUsuarioQuery = 'DELETE FROM Usuarios WHERE id_usuario = ?';
  db.query(deleteUsuarioQuery, [userId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      res.status(500).send('Error interno del servidor');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send(`Usuario con ID ${userId} eliminado exitosamente`);
      } else {
        res.status(404).send(`Usuario con ID ${userId} no encontrado`);
      }
    }
  });
};
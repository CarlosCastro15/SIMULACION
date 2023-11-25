import { Router } from 'express'
import { CrearUsuario,ObtenerUsuarioID,ListaUsuarios,CalcularICM } from '../controllers/usuarios.controller.js'
import { db } from '../db.js'


const router = Router()


// Endpoint para crear usuario
router.post('/crearusuarios', CrearUsuario)

// Endpoint para obtener el historial por ID de usuario
router.get('/historial/:id_usuario',ObtenerUsuarioID)

// Endpoint para obtener lista de usuarios
router.get('/listausuarios', ListaUsuarios)

//Calcular ICM y ponerlo en el historial
router.post('/calcular-icm', CalcularICM)


export default router
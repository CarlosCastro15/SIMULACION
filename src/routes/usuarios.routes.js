import { Router } from 'express'
import { CrearUsuario,ObtenerUsuarioID,ListaUsuarios } from '../controllers/usuarios.controller.js'

const router = Router()


// Endpoint para crear usuario
router.post('/crearusuarios', CrearUsuario)

// Endpoint para obtener un usuario por ID
router.get('/usuario/:id',ObtenerUsuarioID) 

// Endpoint para obtener lista de usuarios
router.get('/listausuarios', ListaUsuarios)

export default router
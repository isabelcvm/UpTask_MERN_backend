import express from "express"
//Se hace un import del controllador para poder usar las funciones que se definen allí
import { 
    usuarios, 
    crearUsuarios, 
    autenticar, 
    confirmar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil 
} from "../controllers/usuarioController.js"
import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();
//------ Autenticando, Creando y Confirmando Usuarios -----------
router.post( '/', crearUsuarios)
router.post( '/login', autenticar)
router.get( '/confirmar/:token', confirmar)
router.post( '/olvide-password', olvidePassword)
router.route( '/olvide-password/:token' ).get( comprobarToken ).post(nuevoPassword)

//------ Profile and Users -----------
router.get( '/perfil', checkAuth, perfil )

export default router;
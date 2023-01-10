//Importar el modelo
import Usuario from "../models/Usuario.js"
import generarId from "../herlpers/generarId.js";
import generarJWT from "../herlpers/generarJWT.js";
import {emailRegistro, emailOlvidePassword } from "../herlpers/email.js";

//Se defienen funciones que contiene toda la información y lógica de cada una de las peticiones http (get- post- put- delte) tales como:
const usuarios = ( req, res) =>{
    res.send(" Desde API USUARIOS ")
};

const crearUsuarios = async ( req, res) =>{

    //5.- Evitando usuarios duplicados.
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email })

    if( existeUsuario ){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message })
    }


    //1.- Se crea un try-cath para debugear errores 
    //2.- Se crea un nuevo Usario del MODELO 
    //3.- Vamos a guardar el usuario en la BD con .save()
    //4.- Luego se retorna el usuario almacenado 

    try {        
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();
        //Enviar correo de confirmación 
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        });
        res.json({msg: 'Usuario creado Correctamente, Revisa tu email para confirmar tu cuenta'})
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async ( req, res ) =>{
    const {email, password} = req.body 

    //Comprobar si el usuario existe 
    const usuario = await Usuario.findOne({email});

    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message })
    }
    //Conprobar si el esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(404).json({msg: error.message })
    }
    //Comprobar su password
    if ( await usuario.comprobarPassword(password) ) {
        res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            password: usuario.password,
            token: generarJWT(usuario._id)
        });
    } else {
        const error = new Error("Tu password es incorrecta ")
        return res.status(404).json({msg: error.message })
    }
}

const confirmar = async ( req, res ) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne( {token} )

    console.log(usuarioConfirmar);

    if (!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(403).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token="";
        console.log(usuarioConfirmar);

        await usuarioConfirmar.save();
        res.json({msg: "Usuario Confirmado Correctamente" })
    } catch (error) {
        console.log(error);
    }
}

//FUNCION PARA EL OLVIDO O RESET DE LA CONTRASENA
const olvidePassword = async  (req, res) =>{
    const {email} = req.body 
    //Busca en la BD si el usuario existe 
    const usuario = await Usuario.findOne({email});

    if (!usuario) {
        const error = new Error("El usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    try {
        //se genera un token nuevo para ese usuario
        usuario.token = generarId();
        //Se guarda en la BD
        await usuario.save();
        res.json({ msg: "Hemos enviado un email con las instrucciones" });
        //Enviar email 
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
    } catch (error) {
        console.log(error);
    }
        
}

const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    
    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {
        res.json({ msg: "Token válido y el usuario existe" });
    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message })
    }
}
const nuevoPassword = async (req, res) =>{
    const { token } = req.params;
    const { password } = req.body;
    
    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password;
        usuario.token = "" ;
        try {
            await usuario.save();
            res.json({ msg: "Password Modificado correctamente" });
        } catch (error) {
            console.log(error);
        }
    } else {    
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message })
    }
};

const perfil = async (req, res) =>{
   const { usuario } = req
    res.json(usuario);
}

//Se hace solo un export como salen multiples funciones
export{
    usuarios,
    crearUsuarios,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}
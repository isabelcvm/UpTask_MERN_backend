import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) =>{
    const { email, nombre, token } = datos;
     
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
     //Informacion del email  
     const info = await transport.sendMail({
        from: ' "UpTask - Administrador de Proyectos" <cuentas@uptask.com> ',
        to: email, 
        subject: "UpTask - Comprueba tu cuenta ", 
        text: "Comprueba tu cuenta  en Uptask",
        html: `
            <p> Hola ${nombre} comprueba tu cuenta en UpTask </p>
            <p>Tu cuenta está casi lista, solo debes comprobarla en el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar ahora </a>
            <p>Si tu no creaste esta cuenta,  puedes ignorar el mensaje</p>
        `
     })
}

export const emailOlvidePassword = async (datos) =>{
    const { email, nombre, token } = datos;
     
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
      });
     //Informacion del email  
     const info = await transport.sendMail({
        from: ' "UpTask - Administrador de Proyectos" <cuentas@uptask.com> ',
        to: email, 
        subject: "UpTask - Reestablece tu password", 
        text: "Reestablece tu password",
        html: `
            <p> Hola ${nombre} has solicitado reestablecer tu password </p>
            <p>El siguiente enlace es para generar una nueva contrasena: </p>
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}"> Reestablecer contrasena ahora </a>
            <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        `
     })
}
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import conectarDB from './config/bd.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRotes from './routes/proyectoRoutes.js'
import tareasRotes from './routes/tareasRoutes.js'

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//Configuracion de Cors
// const whitelist = [ process.env.FRONTEND_URL ];

// const corsOptions = {
//     origin: function(origin, callback) {
//         console.log(origin);
//         if (whitelist.includes(origin)) {
//             //Puede hacer consulta a la API
//             callback( null, true );
//         } else {
//             //No tienes los permisos
//             callback( new Error("Error de Cors"));
//         }
//     }
// }

// app.use(cors(corsOptions));

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

var corsOptions = {
    // origin: 'http://localhost:8080',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, PUT, POST,DELETE"
}

app.use(cors(corsOptions));

//Defenición de Routing
app.use( "/api/usuarios", usuarioRoutes );
app.use( "/api/proyectos", proyectoRotes );
app.use( "/api/tareas", tareasRotes );

//Voy a crear una variable, la misma tomara la variable de entornno que se genere en PRODUCCION, si  no, toma uno por defecto
const PORT = process.env.PORT || 4000;
const servidor = app.listen( PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Socket.io
import { Server } from "socket.io";

const io = new Server( servidor, {
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL,
    },
});

//Se hace la connection:
io.on("connection", (socket)=>{
    //Definir los Eventos de Socket io
    socket.on("abrir proyecto", (proyecto) => {
        socket.join(proyecto);
    });

    socket.on("nueva tarea", (tarea) => {
        socket.to(tarea.proyecto).emit("tarea agregada", tarea)
    });

    socket.on("eliminar tarea", tarea => {
        socket.to(tarea.proyecto).emit("tarea eliminada", tarea)
    });

    socket.on("actualizar tarea", tarea => {
        socket.to(tarea.proyecto._id).emit("tarea actualizada", tarea)
    });

    socket.on('cambiar estado', tarea => {
        socket.to(tarea.proyecto._id).emit("nuevo estado", tarea)
    });
});
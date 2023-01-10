import mongoose from 'mongoose'

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega: {
        type: Date,
        default: Date.now()

    },
    cliente: {
        type: String,
        trim: true,
        required: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    tareas:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tareas"
        }
    ],
    colaboradores: [
        //Tiene corchetes, eso indica que son más de uno. Será un arreglo de usuarios  
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },
    ],

},
    {
        timestamps: true,
    }
);

const Proyecto = mongoose.model("Proyecto", proyectosSchema);
export default Proyecto;
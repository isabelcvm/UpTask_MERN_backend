import mongoose from 'mongoose'

const tareasSchema = mongoose.Schema({
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
    estado:{
        type: Boolean,
        default: false
    },
    fechaEntrega:{
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad:{
        type: String,
        required: true,
        enum: [ 'Baja', 'Media', 'Alta' ] 
        //El enum nos va a permitir incomporar datos a esa variable de bd, pero solo las que estenn dentro del arreglo
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto' 
    },
    completado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario' 
    }
},
{
    timestamps: true,
}
)

const Tareas = mongoose.model("Tareas", tareasSchema);
export default Tareas; 
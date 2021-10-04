import mongoose from 'mongoose';

const MensajeSchema = new mongoose.Schema({
  username: {
    type: 'String',
    maxLength: 50,
    required: true
  },
  email: {
    type: 'String',
    required: true
  },
  fecha: {
    type: 'String',
    maxLength: 50,
    required: true
  },
  pregunta: {
    type: 'String'
  },
  respuesta: {
    type: 'String'
  },
  respondido: {
    type: 'Boolean',
    required: true,
    default: false
  }
},{ timestamps: true });

const Mensaje = mongoose.model('mensaje', MensajeSchema);
export default Mensaje;
import mongoose from 'mongoose';

const OrdenSchema = new mongoose.Schema({
  productos: {
    type: [Object],
    required: true
  },
  time: {
    type: 'String',
    maxLength: 50,
    required: true
  },
  nro: {
    type: 'Number',
    required: true
  },
  estado: {
    type: 'String',
    default: 'Generada',
    required: true
  },
  user: {
    type: 'String',
    required: true
  },
  userID: {
    type: 'String',
    required: true
  },
  email: {
    type: 'String',
    required: true
  },
  total: {
    type: 'Number'
  }
},{ timestamps: true });

export default mongoose.model('orden', OrdenSchema);
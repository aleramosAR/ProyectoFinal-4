import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: 'String',
    maxLength: 50,
    required: true
  },
  descripcion: {
    type: 'String',
    maxLength: 100,
    required: true
  },
  codigo: {
    type: 'Number',
    required: true
  },
  foto: {
    type: 'String',
    maxLength: 100
  },
  precio: {
    type: 'Number',
    required: true
  },
  stock: {
    type: 'Number',
    required: true
  },
  categoria: {
    type: 'String',
    required: true
  },
  timestamp: {
    type: 'String',
    maxLength: 50,
    required: true
  },
});

export default mongoose.model('producto', ProductoSchema);
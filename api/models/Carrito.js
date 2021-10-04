import mongoose from 'mongoose';

const CarritoSchema = new mongoose.Schema({
  productos: {
    type: [Object],
    required: true
  },
  timestamp: {
    type: 'String',
    maxLength: 50,
    required: true
  },
  userID: {
    type: 'String',
    maxLength: 50,
  },
},{ timestamps: true });

export default mongoose.model('carrito', CarritoSchema);
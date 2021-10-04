import Mensaje from './models/Mensaje.js';
import UserAPI from './UserAPI.js'
import { formatDate, storage } from '../utils/index.js'

export default class MensajesAPI {

  // Cargo la lista de mensajes, si soy un admin solo veo los que hay que contestar
  async getMensajes(admin) {
    let mensajes
    if(admin) {
      mensajes = await Mensaje.find({ respondido: false });
    } else {
      mensajes = await Mensaje.find().sort({ consultaID: 1, fecha: 1 });
    }
    return mensajes;
  };

  async getMensajesUser(email) {
    return await Mensaje.find({ email: email }).sort({ consultaID: 1, fecha: 1 });
  };

  // Cargo un solo mensaje segun el ID
  async getMensaje(id) {
    try {
      return await Mensaje.findOne({ _id: id });
    } catch (error) {
      return { error: "El ID no pertenece a un mensaje existente." };
    }
  };

  // Grabo un nuevo mensaje, si el mensaje ya existia signigica que estoy respondiendo a una consulta
  // Si no existe, se trata de una consulta nueva.
  async postMensaje(texto, id = null) {
    try {
      const userAPI = new UserAPI();
      const user = await userAPI.getByID(storage.get('userID'));
      const { username, email } = user;
      
      let mensaje;

      if(!id) {
        mensaje = new Mensaje({
          username: username,
          email: email,
          pregunta: texto,
          fecha: formatDate(new Date())
        });
        await mensaje.save();

      } else {
        mensaje = await Mensaje.updateOne({ _id: id }, {
          respondido: true,
          respuesta: texto
        });
      }
      return mensaje;

    } catch (error) {
      console.log(error);
    }
  };

}

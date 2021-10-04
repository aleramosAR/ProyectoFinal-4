import MensajesAPI from '../api/MensajesAPI.js';

export default class MensajesController {

  constructor() {
    this.mensajesAPI = new MensajesAPI();
  }

  getMensajes = async(req, res) => {
    try {
      const mensajes = await this.mensajesAPI.getMensajes();
      res.status(200).json(mensajes);
    } catch (err) {
      return res.status(404).json({ error: "No hay mensajes cargados." });
    }
  };

  getMensajesUser = async(req, res) => {
    try {
      const mensajes = await this.mensajesAPI.getMensajesUser(req.params.email);
      res.status(200).json(mensajes);
    } catch (err) {
      return res.status(404).json({ error: "No tienes mensajes cargados." });
    }
  };

  getMensaje = async(req, res) => {
    try {
      const mensaje = await this.mensajesAPI.getMensaje(req.params.id);
      res.status(200).json(mensaje);
    } catch (err) {
      return res.status(404).json({ error: "El mensaje no existe." });
    }
  };

  postMensaje = async(req, res) => {
    try {
      const { id } = req.params;
      const { texto } = req.body;
      const newMensaje = await this.mensajesAPI.postMensaje(texto, id);
      res.status(201).json(newMensaje);
    } catch (err) {
      res.status(400).send();
    }
  };
  
  showMensajes = async(admin) => {
    try {
      const mensajes = await this.mensajesAPI.getMensajes(admin);
      return mensajes;
    } catch (err) {
      return { error: "No hay mensajes cargados." };
    }
  };
  

}
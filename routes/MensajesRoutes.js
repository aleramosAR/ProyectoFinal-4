import express from 'express';
import MensajesController from '../controllers/MensajesControllers.js';
import { authAPI } from '../middlewares/Middlewares.js';

export default class MensajesRoutes {
	constructor() {
		this.controller = new MensajesController();
		this.router = express.Router();
		this.router.use(express.json());
	}

	init() {
		this.router.get('/', this.controller.getMensajes);
		this.router.get('/user/:email', this.controller.getMensajesUser);
		this.router.get('/:id', this.controller.getMensaje);
		this.router.post('/', this.controller.postMensaje);
		this.router.post('/:id', this.controller.postMensaje);

		return this.router;
	}
}

import express from 'express';
import OrdenControllers from '../controllers/OrdenControllers.js';

export default class CarritoRoutes {
	constructor() {
		this.controller = new OrdenControllers();
		this.router = express.Router();
		this.router.use(express.json());
	}

	init() {
		this.router.get('/', this.controller.getOrders);
		this.router.get('/:id', this.controller.getOrders);

		return this.router;
	}
}
import express from 'express';
import CarritoControllers from '../controllers/CarritoControllers.js';

export default class CarritoRoutes {
	constructor() {
		this.controller = new CarritoControllers();
		this.router = express.Router();
		this.router.use(express.json());
	}

	init() {
		this.router.get('/', this.controller.getCarritos);
		this.router.get('/comprar', this.controller.getCarritoComprar);
		this.router.get('/productos', this.controller.getCarritoProductos);
		this.router.get('/:id', this.controller.getCarrito);
		this.router.post('/agregar/:id', this.controller.postCarritoProducto);
		this.router.delete('/borrar/:id', this.controller.deleteCarritoProducto);

		return this.router;
	}
}
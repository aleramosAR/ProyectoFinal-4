import express from "express";
import ProductsControllers from '../controllers/ProductsControllers.js';

export default class ProductRoutes {
	constructor() {
		this.controller = new ProductsControllers();
		this.router = express.Router();
		this.router.use(express.json());
	}

	init() {
		this.router.get('/', this.controller.getProducts);
		this.router.get('/:id', this.controller.getProduct);
		this.router.get('/categoria/:categoria', this.controller.getProductsCategpry);
		
		this.router.post('/', this.controller.postProduct);
		this.router.put('/actualizar/:id', this.controller.updateProduct);
		this.router.delete('/borrar/:id', this.controller.deleteProduct);

		return this.router;
	}
}
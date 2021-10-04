import ProductosAPI from '../api/ProductosAPI.js';
import { storage } from '../utils/index.js';

export default class ProductsController {
	constructor() {
		this.productosAPI = new ProductosAPI();
	}

	getProducts = async (req, res) => {
		try {
			let resumed = null;
			let filtros = [];
			if (req.query.resumed === "true") {
				resumed = true;
			} else {
				if (Object.keys(req.query).length) {
					Object.keys(req.query).map((item) => filtros.push(item));
					Object.values(req.query).map((item) => filtros.push(item));
				}
			}
			const prods = await this.productosAPI.read(null, filtros, resumed);
			if (!prods) {
				throw new Error('No hay productos cargados.');
			}
			res.status(200).json(prods);
		} catch (err) { return res.status(404).json({ error: 'No hay productos cargados.' }); }
	};

	getProductsCategpry = async (req, res) => {
		try {
			const prods = await this.productosAPI.categoria(req.params.categoria);
			if (!prods) {
				throw new Error('No hay productos en esta cateogira.');
			}
			res.status(200).json(prods);
		} catch (err) { return res.status(404).json({ error: 'No hay productos en esta cateogira.' }); }
	};

	getProduct = async (req, res) => {
		try {
			const { id } = req.params;
			const prod = await this.productosAPI.read(id);
			if (!prod) {
				throw new Error('Producto no encontrado.');
			}
			return res.status(200).json(prod);
		} catch (err) { return res.status(404).json({ error: 'Producto no encontrado.' }); }
	};

	postProduct = async (req, res) => {
    try {
      if (!storage.getAdmin()) {
        return res.status(403).json({ error: -1, descripcion: "Ruta /productos, metodo 'agregar' no autorizado", });
      }
      const product = req.body;
      const newProd = await this.productosAPI.create(product);
      res.status(201).json(newProd);
    } catch (err) { return res.status(400).json({ error: 'Se produjo un error.' }); }
	};

  updateProduct = async (req, res) => {
    try {
      if (!storage.getAdmin()) {
        return res.status(403).json({ error: -1, descripcion: "Ruta /productos, metodo 'actualizar' no autorizado", });
      }
      const { id } = req.params;
      const product = req.body;
      // Ejecuto el update y recibo la respuesta en una variable.
      // Si el producto que intente actualizar existe lo devuelvo con un status 200.
      // Si el producto que intente actualizar no existe devuelvo un error con un status 404.
      const prod = await this.productosAPI.update(id, product);
      if (prod) {
        return res.status(200).json(prod);
      }
    } catch (err) { return res.status(404).json({ error: 'Producto no encontrado.' }); }
	};

  deleteProduct = async(req, res) => {
    try {
      if (!storage.getAdmin()) {
        return res.status(403).json({ error: -1, descripcion: "Ruta /productos, metodo 'borrar' no autorizado", });
      }
      const prod = await this.productosAPI.delete(req.params.id);
      if (prod) {
        return res.status(200).json(prod);
      }
    } catch (err) { return res.status(404).json({ error: 'Producto no encontrado.' }); }
	};

}
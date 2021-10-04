import fetch from "node-fetch";
import Producto from './models/Producto.js';
import { URL_BASE } from '../config.js';

export default class ProductosAPI {
	// Creacion de un nuevo producto
	async create(data) {
		if (data.nombre === '' || typeof data.nombre === 'undefined') return false;
		if (data.precio === '' || typeof data.precio === 'undefined') return false;
		if (data.foto === '' || typeof data.foto === 'undefined') return false;

		const newProducto = new Producto({
			nombre: data.nombre,
			descripcion: data.descripcion,
			codigo: data.codigo,
			foto: data.foto,
			precio: data.precio,
			stock: data.stock,
			categoria: data.categoria,
			timestamp: Date.now(),
		});
		
		await newProducto.save();
		return newProducto;
	}

	// Muestro los productos, si se pasa un ID solo levanta ese.
	// Si filtros viene diferente a [], entonces devuelvo el listado filtrado.
	// Si la variable "resumed" viene en "true" entonces devuelvo un subset de campos.
	async read(id, filtros = [], resumed = null) {
		let subset = null;
		if (resumed === true) {
			subset = { codigo: 1, nombre: 1, precio: 1 };
		}
		try {
			if (id) {
				const prod = await Producto.findOne({ _id: id });
				return prod ? prod : false;
				
			} else {
				let snap;
				if (filtros.length) {
					switch(filtros[0]) {
						case "nombre":
							snap = await Producto.find({ nombre: { $regex: filtros[1] } }, subset);
						break;
						case "codigo":
							snap = await Producto.find({ codigo: parseInt(filtros[1]) }, subset);
						break;
						case "premin":
							snap = await Producto.find({ precio: {$gte: parseInt(filtros[2]), $lte: parseInt(filtros[3])} }, subset);
						break;
						case "stkmin":
							snap = await Producto.find({ stock: {$gte: parseInt(filtros[2]), $lte: parseInt(filtros[3])} }, subset);
						break;
					}
				} else {
					snap = await Producto.find({}, subset);
				}
				return (snap.length > 0) ? snap : false;
			}
		} catch (err) {
			return false;
		}
	}

	// Updata de productos
	async update(id, data) {
		data.timestamp = Date.now();
		await Producto.updateOne({ _id: id }, data);
		return data;
	}

	// Elimino el producto
	async delete(id) {
		try {
			const res = await Producto.deleteOne({ _id: id });
			if (res.n) {
				// LLamo a la funcion para borrar el producto del carrito
				fetch(`${URL_BASE}/api/carrito/borrar/${id}`, {
					method: 'DELETE',
				});
				return JSON.stringify(res);
			}
			return false;
		} catch (err) {
			return false;
		}
	}

	// Si viene de la ruta /categorias/:id entonces mostrara solo los items de esa categoria.
	async categoria(categoria) {
		try {
			const prod = await Producto.find({ categoria: categoria.toLowerCase() });
			return (prod.length > 0) ? prod : false;
		} catch (err) {
			return false;
		}
	}

}
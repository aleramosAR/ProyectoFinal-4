import fetch from "node-fetch";
import Carrito from './models/Carrito.js';
import Orden from './models/Orden.js';
import { OrdenDTO } from './DTO/OrdenDTO.js'
import UserAPI from './UserAPI.js'
import { URL_BASE } from '../config.js';
import { formatDate, storage } from '../utils/index.js'

export default class CarritoAPI {
	constructor() {
		this.productos = null;
	}

	async getCarrito() {
		const userID = storage.get('userID');
		const carrito = await Carrito.findOne({ userID: userID });
		if (!carrito) {
			const newCarrito = new Carrito({
				productos: [],
				timestamp: formatDate(new Date()),
				userID: userID,
			});
			await newCarrito.save();
			return newCarrito;
		} else {
			return carrito;
		}
	}

	async read() {
		const carrito = await this.getCarrito();
		const productos = await carrito.productos;
		const tempCarrito = {
			id: carrito._id,
			timestamp: carrito.timestamp,
			userID: carrito.userID,
		};

		if (productos.length > 0) {
			const carritoprods = [];
			await this.getProductos();
			productos.forEach((x) => {
				const prod = this.productos.filter((prod) => prod._id === x.id)[0];
				if (prod) {
					prod["cantidad"] = x.cantidad;
					carritoprods.push(prod);
				}
			});
			tempCarrito.productos = carritoprods;
		}
		return tempCarrito;
	}

	// Devuelvo el listado completo, si el listado esta vacio devuelvo false para hacer el chequeo
	async readProds(id) {
		const carrito = await this.getCarrito();
		const productos = carrito.productos;

		if (productos.length > 0) {
			if (id) {
				if (!productos.includes(id)) {
					return { error: 'Producto no encontrado en el carrito.' };
				}
				const res = await fetch(`${URL_BASE}/api/productos/${id}`);
				return await res.json();
			}
			const carritoprods = [];
			await this.getProductos();
			productos.forEach((x) => {
				const prod = this.productos.filter((prod) => prod._id === x.id)[0];
				prod["cantidad"] = x.cantidad;
				carritoprods.push(prod);
			});
			return carritoprods;
		}
		return false;
	}

	async addProd(id, cn) {
		// Cargo los productos del carrito actual
		const carrito = await this.getCarrito();
		const carritoProductos = carrito.productos;
		
		// Chequeo que el producto a agregar exista
		const res = await fetch(`${URL_BASE}/api/productos/${id}`);
		const producto = res.status === 200 ? await res.json() : null;
		if (!producto) {
			return { error: `El producto con el id '${id}' no existe.` };
		}

		// Si el producto no esta en el carrito lo agrego, y si existe modifico la cantidad
		const currentIndex = carritoProductos.findIndex((prod) => prod.id === id);
		if (currentIndex === -1) {
			carritoProductos.push({id: id.toString(), cantidad: parseInt(cn)});
		} else {
			carritoProductos[currentIndex].cantidad =  parseInt(cn);
		}

		// Grabo los items agregados al carrito.
		await Carrito.updateOne({ userID: storage.get('userID') }, { productos: carritoProductos });
		
		return producto;
	}

	async deleteProd(id) {
		// Chequeo que item del array tiene el mismo ID para seleccionarlo
		let index;
		const carrito = await this.getCarrito();
		const productosList = carrito.productos;
		for (let i = 0; i < productosList.length; i++) {
			if (productosList[i].id === id) {
				index = i;
				break;
			}
		}
		// // Si el item existe lo elimino del carrito.
		if (index != undefined) {
			const producto = await this.readProds(productosList[index]);;
			productosList.splice(index, 1);

			await Carrito.updateOne({ userID: storage.get('userID') }, { productos: productosList });
			return producto;
		}
	}

	async comprar() {
		try {
			const carrito = await this.read();
			if (!carrito.productos) {
				return { error: 'El carrito esta vacío.' }
			}
			const userAPI = new UserAPI();
			const user = await userAPI.getByID(carrito.userID);
			
			// Cargo la ultima orden para tener el ultimo nro de orde.
			const lastOrder = await Orden.findOne({}, { nro: 1 }).sort({nro: -1}) || 1;
			const nro = (lastOrder.nro) ? lastOrder.nro + 1 : 1;

			const ordenDTO = OrdenDTO({
				user: user.username,
				userID: user._id,
				email: user.email,
				productos: carrito.productos,
				nro: nro
			});
			const orden = new Orden(ordenDTO);
			await orden.save();

			// Elimino el carrito ya que la compra esta hecha.
			await Carrito.deleteOne({ userID: carrito.userID });
			return orden;

		} catch (error) {
			return false;
		}
	}

	async getProductos() {
		const res = await fetch(`${URL_BASE}/api/productos?resumed=true`);
		if (res.status === 200) {
			this.productos = await res.json();
		} else {
			this.productos = [];
		}
	}
}
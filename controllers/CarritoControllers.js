import CarritoAPI from '../api/CarritoAPI.js';

export default class CarritoController {
	constructor() {
		this.carritoAPI = new CarritoAPI();
	}

	getCarritos = async (req, res) => {		
    const carritoData = await this.carritoAPI.read();
		if (!carritoData) {
			return res.status(404).json({
				error: 'No hay carritos creados.',
			});
		}
		res.json(carritoData);
	};

  getCarritoComprar = async (req, res) => {		
    const ordenData = await this.carritoAPI.comprar();
		if (!ordenData) {
			res.status(404).json({ error: 'Se ha producido un error.' });
		} else {
			res.status(200).json(ordenData);
		}
	};

  getCarritoProductos = async (req, res) => {		
    // const carrito = CarritoDAO.getInstance();
    const productos = await this.carritoAPI.readProds();
    if (!productos) {
      return res.status(404).json({
        error: 'No hay productos en el carrito.',
      });
    }
    res.json(productos);
	};

  getCarrito = async (req, res) => {		
		const { id } = req.params;
		const producto = await this.carritoAPI.readProds(id);
		if (producto) {
			return res.json(producto);
		}
		res.status(404).json({
			error: 'Producto no encontrado en el carrito.',
		});
	};

  postCarritoProducto = async (req, res) => {		
    const { id } = req.params;
		const { cn } = req.query;
    const newProduct = await this.carritoAPI.addProd(id, cn);
    if (newProduct) {
      res.status(201).json(newProduct);
    }
    res.status(400).send();
	};

  deleteCarritoProducto = async (req, res) => {		
    // const carrito = CarritoDAO.getInstance();
		const { id } = req.params;

		// Elimino el producto segun el id que se paso y recibo la respuesta en una variable.
		// Si el producto que intente eliminar existe lo devuelvo con un status 200.
		// Si el producto que intente eliminar no existe devuelvo un error con un status 404.
		const prod = await this.carritoAPI.deleteProd(id);
		if (prod) {
			return res.status(200).json(prod);
		}
		res.status(404).json({
			error: 'Producto no encontrado en el carrito.',
		});
	};

}
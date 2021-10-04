import OrdenesAPI from '../api/OrdenesAPI.js';

export default class OrdenesController {
	constructor() {
		this.ordenesAPI = new OrdenesAPI();
	}

	getOrders = async (req, res) => {
		const { id } = req.params;
		try {
			let ordenes;
			if (id) {
				ordenes = await this.ordenesAPI.read(id);
			} else {
				ordenes = await this.ordenesAPI.read();
			}
			if (!ordenes) {
				throw new Error('No hay ordenes grabadas.');
			}
			res.status(200).json(ordenes);
		} catch (err) { return res.status(404).json({ error: 'No hay ordenes grabadas.' }); }
	};

  getOrdersUser = async (req, res) => {
    return [];
		// try {
		// 	const prods = await this.productosAPI.read(null, filtros, resumed);
		// 	if (!prods) {
		// 		throw new Error('No hay productos cargados.');
		// 	}
		// 	res.status(200).json(prods);
		// } catch (err) { return res.status(404).json({ error: 'No hay productos cargados.' }); }
	};

}
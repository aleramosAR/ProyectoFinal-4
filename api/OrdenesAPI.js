import Orden from './models/Orden.js';

export default class OrdenesAPI {

	// Levanto las ordenes, si defino el ID solo muestra 1, si no, devuelve todas
	async read(id) {
		try {
			if (id) {
				return await Orden.find({ userID: id });
			} else {
				return await Orden.find();
			}
		} catch (err) {
			return false;
		}
	}

}
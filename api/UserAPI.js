import User from './models/User.js';

let instance = null;

export default class UserAPI {

	// Uso el patron singleton ya que levanto esta clase en diferentes lugares para tomar datos
	// Y evito crear mas de una instancia de la misma
	static getInstance() {
		if (!instance) {
			instance = new UserAPI();
		}
		return instance;
	}

	async getByID(id) {
		return await User.findOne({ _id: id }, { username: 1, email: 1, telefono: 1, direccion: 1 });
	}

	async update(id, data) {
		data.timestamp = Date.now();
		await User.updateOne({ _id: id }, data);
		return data;
	}

}
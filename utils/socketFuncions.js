import fetch from "node-fetch";
import MensajesController  from '../controllers/MensajesControllers.js';
import { storage } from './storage.js';
import { URL_BASE } from '../config.js';

const mensajesController = new MensajesController();

export const getProductsSocket = async() => {
	const res = await fetch(`${URL_BASE}/api/productos`);
	return await res.json();
}

export const getProductsCategoriaSocket = async(categoria) => {
	const res = await fetch(`${URL_BASE}/api/productos/categoria/${categoria}`);
	return await res.json();	
}

export const getCarritoSocket = async() => {
	const res = await fetch(`${URL_BASE}/api/carrito`);
	return await res.json();
}

export const getMensajesSocket = async() => {
	const ADMIN = storage.getAdmin();
	try {
		return await mensajesController.showMensajes(ADMIN);
	}
	catch (e) { console.log(e); }
};
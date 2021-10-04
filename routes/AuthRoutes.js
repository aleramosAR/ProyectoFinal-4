import express from "express";
import AuthControllers from '../controllers/AuthControllers.js';

export default class AuthRoutes {
	constructor() {
		this.controller = new AuthControllers();
		this.router = express.Router();
		this.router.use(express.json());
	}

	init() {
    this.router.get('/logout', this.controller.getLogout);

		return this.router;
	}
}
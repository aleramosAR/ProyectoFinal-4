import express from "express";
import FrontControllers from '../controllers/FrontControllers.js';
import { isAuth, upload } from '../middlewares/Middlewares.js';

export default class FrontRoutes {
	constructor() {
    this.controller = new FrontControllers();
		this.router = express.Router();
    this.router.use(express.json());
	}

	init() {
    // Rutas de navegacion principal y registro
    this.router.get('/', this.controller.goIndex);
    this.router.get('/login', this.controller.goLogin);
    this.router.get('/logout', this.controller.goLogout);
    this.router.get('/register', this.controller.goRegister);
    this.router.get('/upload', isAuth, this.controller.goUpload);
    this.router.post('/uploadfile', upload.single('avatar'), this.controller.goUploadFile);
    this.router.get('/unauthorized', this.controller.goUnauthorized);

    // Rutas de productos
    this.router.get('/productos', isAuth, this.controller.goProductos);
    this.router.get('/productos/nuevo', isAuth, this.controller.goProductosNuevo);
    this.router.get('/productos/actualizar/:id', isAuth, this.controller.goProductosActualizar);
    this.router.get('/productos/upload/:id', isAuth, this.controller.goProductosUpload);
    this.router.get('/productos/categoria/:id', isAuth, this.controller.goProductosCategoria);
    this.router.post('/productos/uploadfile', upload.single('product'), this.controller.goProductosUploadFile);
    this.router.get('/productos/:id', isAuth, this.controller.goProducto);
    this.router.get('/images/:productoid', this.controller.goShowImagen);

    // Rutas de carrito
    this.router.get('/carrito', isAuth, this.controller.goCarrito);
    this.router.get('/comprar', isAuth, this.controller.goComprar);
    this.router.get('/orden', isAuth, this.controller.goOrden);
    this.router.get('/orden-error', isAuth, this.controller.goOrdenError);
    this.router.get('/ordenes/:userid', isAuth, this.controller.goMisOrdenes);

    // Rutas de chat
    this.router.get('/chat', isAuth, this.controller.goChat);
    this.router.get('/chat/responder/:id', isAuth, this.controller.goChatResponder);

    // Rutas extras
    this.router.get('/parametros', this.controller.goParametros);

    return this.router;
	}

}
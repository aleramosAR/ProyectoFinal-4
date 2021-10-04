import express from "express";
import passport from "passport";
import ProductRoutes from './ProductRoutes.js';
import CarritoRoutes from './CarritoRoutes.js';
import FrontRoutes from './FrontRoutes.js';
import AuthRoutes from "./AuthRoutes.js";
import OrdenRoutes from "./OrdenRoutes.js";
import MensajesRoutes from './MensajesRoutes.js';

const router = express.Router();
router.use(express.json());
router.use(passport.initialize());
router.use(passport.session());

const frontRoutes = new FrontRoutes();
const productRoutes = new ProductRoutes();
const carritoRoutes = new CarritoRoutes();
const authRoutes = new AuthRoutes();
const ordenRoutes = new OrdenRoutes();
const mensajesRoutes = new MensajesRoutes();

router.post('/login', passport.authenticate('login', {
  failureRedirect: '/login',
  successRedirect: '/productos',
  failureFlash: true
}))
router.post('/register', passport.authenticate('register', {
  failureRedirect: '/register',
  successRedirect: '/upload',
  failureFlash: true
}))

router.use('/', frontRoutes.init(router));
router.use('/api/auth', authRoutes.init(router));
router.use('/api/productos', productRoutes.init(router));
router.use('/api/carrito', carritoRoutes.init(router));
router.use('/api/ordenes', ordenRoutes.init(router));
router.use('/api/mensajes', mensajesRoutes.init());

// Middleware para mostrar error si la ruta no existe
router.use(function(req, res, next) {
	res.status(404)
	res.json({error : -2, descripcion: `Ruta '${req.url}' no implementada`});
});;

export default router;
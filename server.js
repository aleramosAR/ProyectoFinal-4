import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import routes from './routes/index.js';
import { logger, storage, configPassport, configMongo, storeData, configHandlebars } from './utils/index.js';
import { PORT } from './config.js';
import {
	getProductsSocket,
	getProductsCategoriaSocket,
	getCarritoSocket,
	getMensajesSocket
} from './utils/socketFuncions.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
configApp(app);

(async () => {
	try {
		await configMongo("dbaas");
		connectSocket(io);
	} catch (err) {
		logger.error(err.message);
	}
})();

// Funcion para agregar toda la configuracion al 'app'.
function configApp(app) {
	app.use(cookieParser());
	app.use(session(storeData));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static("public"));
	app.use(flash());
	app.set("views", "./views");
	app.engine("hbs", configHandlebars);
	app.set("view engine", "hbs");
	app.set('view engine', 'pug');
	app.use(configPassport.initialize());
	app.use(configPassport.session());
	app.use(routes);
}

function connectSocket(io) {
	io.on("connection", (socket) => {
		logger.info("Nuevo cliente conectado!");
		const url = socket.handshake.headers.referer.split("/").pop();
		const ADMIN = storage.getAdmin();
		switch (url) {
			case "productos": 
				(async ()=>{
					const initialProducts = await getProductsSocket();
					io.sockets.emit("listProducts", { productos: { productos: initialProducts }, admin: ADMIN });
				})()
				break;
			case "indumentaria":
			case "accesorios":
			case "calzado":
				(async ()=>{
					const initialProducts = await getProductsCategoriaSocket(url);
					io.sockets.emit("listProducts", { productos: { productos: initialProducts }, admin: ADMIN });
				})()
				break;
			case "carrito":
				(async ()=>{
					const initialCarrito = await getCarritoSocket();
					io.sockets.emit("listCarrito", { carrito: initialCarrito, admin: ADMIN  });
				})()
				break;
			case "chat":
				(async ()=>{
					const initialMensajes = await getMensajesSocket();
					io.sockets.emit("listMensajes", { mensajes: initialMensajes, admin: ADMIN });
				})()
				break;
		}

		/* Escucho los mensajes enviado por el cliente y se los propago a todos */
		socket.on("removeProduct", async() => {
			const data = await getProductsSocket();
			io.sockets.emit("listProducts", { productos: { productos: data }, admin: storage.getAdmin() });
		}).on("filterProducts", (productos) => {
			io.sockets.emit("listProducts", { productos: productos, admin: storage.getAdmin() });	
		}).on("postMensaje", async() => {
			const mensajes = await getMensajesSocket();
			io.sockets.emit("listMensajes", { mensajes: mensajes, admin: ADMIN });
		}).on("removeCarritoProduct", async() => {
			const data = await getCarritoSocket();
			io.sockets.emit("listCarrito", { carrito: data, admin: ADMIN  });
		}).on('disconnect', () => {
			logger.info('Usuario desconectado')
		});
	});
}

// Conexion a server con callback avisando de conexion exitosa
httpServer.listen(PORT, () => { logger.info(`Ya me conecte al puerto ${PORT}.`) })
.on('error', (error) => logger.error(`Hubo un error inicializando el servidor: ${error}`) );
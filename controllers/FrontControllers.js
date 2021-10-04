import fetch from "node-fetch";
import UserAPI from "../api/UserAPI.js";
import ProductosAPI from "../api/ProductosAPI.js";
import { config, URL_BASE, ADMIN_EMAIL } from '../config.js';
import { sendMailEthereal, storage } from '../utils/index.js';

export default class FrontControllers {

  goIndex = (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('productos');
    } else {
      res.render("views_main/index.hbs");
    }
  };

  goLogin = (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('productos');
    } else {
      res.render("views_main/login.hbs", { message: req.flash('message') });
    }
  }

  goLogout = (req, res) => {
    if (req.session.passport) {
      const { username } = req.session.passport.user;
      req.logout();
      res.render("views_main/logout.hbs", { username: username });
    } else {
      res.redirect('/');
    }
  }

  goRegister = (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('productos');
    } else {
      res.render("views_main/register.hbs", { message: req.flash('message') });
    }
  }

  goUnauthorized = (req, res) => {
    res.render("views_main/unauthorized.hbs");
  }

  goUpload = (req, res) => {
    const { username, _id } = req.session.passport.user;
    res.render("views_main/upload.hbs", { username: username, id: _id });
  }

  goProductos = (req, res) => {
    fetch(`${URL_BASE}/api/productos`).then(res => res.json()).then((data) => {
      res.render("views_productos/productos.hbs", { productos: data, admin: storage.getAdmin(), user: req.session.passport.user });
    });
  }

  goProductosCategoria = (req, res) => {
    fetch(`${URL_BASE}/api/productos/categoria/${req.params.id}`).then(res => res.json()).then((data) => {
      res.render("views_productos/productos.hbs", { productos: data, admin: storage.getAdmin(), user: req.session.passport.user, categorias: true, categoria: req.params.id });
    });
  }

  goProducto = (req, res) => {
    const { id } = req.params;
    fetch(`${URL_BASE}/api/productos/${id}`).then(res => res.json()).then((data) => {
      res.render("views_productos/producto.hbs", { producto: data, admin: storage.getAdmin(), user: req.session.passport.user });
    });
  }

  goProductosActualizar = (req, res) => {
    const { id } = req.params;
    fetch(`${URL_BASE}/api/productos/${id}`).then(res => res.json()).then((data) => {
      res.render("views_productos/actualizar.hbs", { producto: data, user: req.session.passport.user });
    });
  }

  goProductosNuevo = (req, res) => {
    res.render("views_productos/nuevo.hbs", { user: req.session.passport.user });
  }

  goProductosUpload = (req, res) => {
    res.render("views_productos/productoupload.hbs", { user: req.session.passport.user, productID: req.params.id });
  }

  goProductosUploadFile = async(req, res, next) => {
    const file = req.file;
    const productID = req.body.productID;

    if (!file) {
      const error = new Error('Por favor suba una imagen');
      error.httStatusCode = 400;
      return false;
    }

    const producto = new ProductosAPI();
    const data = { 'foto': file.filename };
    await producto.update(productID, data);
    
    res.redirect('../productos');
  }

  goCarrito = (req, res) => {
    fetch(`${URL_BASE}/api/carrito`).then(res => res.json()).then((data) => {
      res.render("views_carrito/carrito.hbs", { carrito: data, admin: storage.getAdmin(), user: req.session.passport.user });
    });
  }

  goOrden = (req, res) => {
    res.render("views_carrito/orden.hbs");
  }

  goOrdenError = (req, res) => {
    res.render("views_carrito/orden-error.hbs");
  }

  goChat = (req, res) => {
    res.render("views_chat/chat.hbs", { admin: storage.getAdmin(), user: req.session.passport.user });
  }

  goChatResponder = (req, res) => {
    fetch(`${URL_BASE}/api/mensajes/${req.params.id}`).then(res => res.json()).then((data) => {;
      res.render("views_chat/chat-respuesta.hbs", { pregunta: data, user: req.session.passport.user });
    });
  }

  goMisOrdenes = (req, res) => {
    fetch(`${URL_BASE}/api/ordenes/${req.params.userid}`).then(res => res.json()).then((data) => {;
      res.render("views_carrito/ordenes.hbs", { ordenes: data, user: req.session.passport.user });
    });
  }
  
  goComprar = async(req, res) => {
    const respond = await fetch(`${URL_BASE}/api/carrito/comprar`);
			const data = await respond.json();

			if (respond.status == 200) {
        // Levanto los datos de la orden para enviar los mensajes al comprador y al admin.
        const { time, user, email, productos } = data;

        let textoprods = "";
        let total = 0;
        productos.forEach(prod => {
          textoprods +=
          `
            Producto: ${prod.nombre}<br />
            Codigo: ${prod.codigo}<br />
            Precio: $${prod.precio}<br /><br />
          `;
          total += prod.precio;
        });

				// MAIL AL ADMIN.
        // Avisando de la nueva compra.
				const asunto = `Nueva compra de ${user}`;
				const cuerpo = `
					<h2>El usuario ${user} ha hecho una compra!</h2>
          <strong>Horario:</strong> ${time}
          <br />
          <h3>Articulos comprados:</h3>
          ${textoprods}
          <strong>Total: <span style='color:green'>$${total}</span></strong><br />
          <h3>Datos de envío:</h3>
					<strong>Nombre:</strong> ${user},<br />
					<strong>Email:</strong> ${email}.
				`;

        await sendMailEthereal({
          to: ADMIN_EMAIL,
          subject: asunto,
          html: cuerpo
        });

        // Redirect a  pagina mostrando que la orden fue exitosa.
				res.redirect('orden');
			} else {
        // Redirect a  pagina mostrando que hubo un error en la orden.
				res.redirect('orden-error');
			}
    
  }

  goUploadFile = async(req, res, next) => {
    const file = req.file;
    
    if (!file) {
      const error = new Error('Por favor suba una imagen');
      error.httStatusCode = 400;
      return false;
    }
    const user = UserAPI.getInstance();
    const data = { 'foto': file.filename };
    await user.update(req.session.passport.user._id, data);
    
    req.session.passport.user.foto = file.filename;
    res.redirect('productos');
  }

  goParametros = (req, res) => {
    res.render("views_extra/parametros.pug", { parametros: config });
  }

  goShowImagen = async(req, res) => {
    const id = req.params.productoid;
    const productoAPI = new ProductosAPI();
    const producto = await productoAPI.read(id);
    res.render("views_productos/imagen.hbs", { imagen: producto.foto });
  }

}
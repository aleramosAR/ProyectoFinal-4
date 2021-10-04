const socket = io.connect();
const getUrl = window.location;
const baseUrl = getUrl.protocol + "//" + getUrl.host;
const errormsg = "Hubo un problema con la petición Fetch: ";
const URL_BASE = 'http://localhost:8080';
// const URL_BASE = 'https://coder-final-36.herokuapp.com';

function clickDesloguear() {
  window.location.replace("/logout");
  return false;
}

// Al agregar productos recibo el evento 'listProducts' desde el server y actualizo el template
socket.on('listProducts', async (data) => {
  const { productos, admin } = data;
  const archivo = await fetch('/plantillas/listado.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({productos, admin});
  document.getElementById('productos').innerHTML = result;
});

socket.on('listCarrito', async (data) => {
  const { carrito, admin } = data;
  const archivo = await fetch('/plantillas/tabla.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({carrito, admin});
  document.getElementById('tabla').innerHTML = result;
});

socket.on('listMensajes', async (data) => {
  const { mensajes, admin } = data;
  const archivo = await fetch('/plantillas/mensajes.hbs');
  const archivoData = await archivo.text();
  const template = Handlebars.compile(archivoData);
  const result = template({ mensajes, admin });
  document.getElementById('mensajes').innerHTML = result;
});

const clickFiltrarProductos = () => {
  const active = $(".list-group-item.active").attr("id");
  let filter = null;
  switch (active) {
    case "l-no":
      if (filNombre.value == "") {
        filter = null;
      } else {
        filter = `nombre=${filNombre.value}`
      }
      break;
    case "l-co":
      if (filCodigo.value == "") {
        filter = null;
      } else {
        filter = `codigo=${filCodigo.value}`
      }
      break;
    case "l-pr":
      if (filPrecioMin.value == "" || filPrecioMax.value == "") {
        filter = null;
      } else {
        filter = `premin=${filPrecioMin.value}&premax=${filPrecioMax.value}`
      }
      break;
    case "l-st":
      if (filStockMin.value == "" || filStockMax.value == "") {
        filter = null;
      } else {
        filter = `stkmin=${filStockMin.value}&stkmax=${filStockMax.value}`
      }
      break;
    default:
      alert('Elegir algun filtro de búsqueda.');
  }

  const query = filter ? `${baseUrl}/api/productos?${filter}` : `${baseUrl}/api/productos`;
  cargarDatos(query)
  .then(data => {
    socket.emit('filterProducts', { productos: data });
  }).catch(error => {
    console.log(errormsg + error.message);
  });

  return false;
}

const clickQuitarFiltros = () => {
  cargarDatos(`${baseUrl}/api/productos`)
  .then(data => {

    filNombre.value = "";
    filCodigo.value = "";
    filPrecioMin.value = "0";
    filPrecioMax.value = "1000";
    filStockMin.value = "0";
    filStockMax.value = "100";
    
    socket.emit('filterProducts', { productos: data });
  }).catch(error => {
    console.log(errormsg + error.message);
  });
}


// Funcion para hacer el POST de datos
const cargarDatos = async(url = '') => {
  const response = await fetch(url);
  return response.json();
}


// Callback del boton submit, chequea que el form este completo y llama a la APIproducto nuevo
const crearProducto = () => {
  if (nombre.value == '' || descripcion.value == '' || precio.value == '' || codigo.value == '' || stock.value == '' || categoria.value == '') {
    alert('Por favor llena el formulario.')
  } else {
    const newProd = {
      "nombre": nombre.value,
      "descripcion": descripcion.value,
      "precio": precio.value,
      "foto": "template-product.jpg",
      "codigo": codigo.value,
      "stock": stock.value,
      "categoria": categoria.value
    };

    enviarDatos(`${baseUrl}/api/productos`, newProd, 'POST')
    .then((data) => {
      window.location.replace(`/productos/upload/${data._id}`);
    }).catch(error => {
      console.log(errormsg + error.message);
    });
  }
  return false;
}

const actualizarProducto = (id) => {
  if (nombre.value == '' || descripcion.value == '' || precio.value == '' || codigo.value == '' || stock.value == '' || categoria.value == '') {
    alert('Por favor llena el formulario.')
  } else {
    const newProd = {
      "nombre": nombre.value,
      "descripcion": descripcion.value,
      "precio": precio.value,
      "codigo": codigo.value,
      "stock": stock.value,
      "categoria": categoria.value
    };
    enviarDatos(`${baseUrl}/api/productos/actualizar/${id}`, newProd, 'PUT')
    .then(() => {
      window.location.replace("/productos");
    }).catch(error => {
      console.log(errormsg + error.message);
    });
  }
  return false;
}

// Funcion para hacer el POST de datos
const enviarDatos = async(url = '', data = {}, metodo) => {
  const response = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

const clickDelete = (id) => {
  prodDelete(`${baseUrl}/api/productos/borrar/${id}`)
  .then(() => {
    socket.emit('removeProduct');
  }).catch(error => {
    console.log(errormsg + error.message);
  });
  return false;
}

// Funcion para hacer el DELETE de producto
const prodDelete = async(url = '', id = {}) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

const clickAgregarCarrito = (id, cn) => {
  if (parseInt(cn) < 1) {
    alert("Ingrese una cantidad igual o superior a 1.")
    return false;
  }
  prodAgregarCarrito(`${baseUrl}/api/carrito/agregar/${id}?cn=${cn}`)
  .then(() => {
    location.href = '/carrito';
  }).catch(error => {
    console.log(errormsg + error.message);
  });
  return false;
}

// Funcion para hacer el DELETE de producto
const prodAgregarCarrito = async(url = '', id = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

const clickDeleteCarrito = (id) => {
  prodDeleteCarrito(`${baseUrl}/api/carrito/borrar/${id}`)
  .then(() => {
    socket.emit('removeCarritoProduct');
  }).catch(error => {
    console.log(errormsg + error.message);
  });
  return false;
}

// Funcion para hacer el DELETE de producto
const prodDeleteCarrito = async(url = '', id = {}) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Click de COMPRAR el el carrito
const clickComprar = async() => {
  await fetch(`${baseUrl}/comprar`);
}





// Agregar un nuevo mensaje.
function addMensaje(e) {
  const inputTexto = document.getElementById('texto');
  
  if (inputTexto.value == '') {
    alert('Por favor complete el formulario para enviar un mensaje.')
  } else {
    const newMensaje = { texto: inputTexto.value };
    agregarMensaje(`${URL_BASE}/api/mensajes`, newMensaje)
    .then(() => {
      socket.emit('postMensaje');
      inputTexto.value = '';
      inputTexto.focus();
    }).catch(error => {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
  return false;
}

// Responder al mensaje.
function addRespuesta(e) {
  const inputTexto = document.getElementById('texto');
  const respondiendo = document.getElementById('respondiendo');;
  
  if (inputTexto.value == '') {
    alert('Por favor complete el formulario para enviar un mensaje.')
  } else {
    const newMensaje = { texto: inputTexto.value };
    agregarMensaje(`${URL_BASE}/api/mensajes/${respondiendo.value}`, newMensaje)
    .then(() => {
      window.location.replace("/chat");
    }).catch(error => {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
  return false;
}

// Funcion para hacer el POST de mensaje
async function agregarMensaje(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (response.status == 401) {
    window.location.replace("/unauthorized");
  }
  return response.json();
}









async function destroySession() {
  try {
    const res = await fetch(`${URL_BASE}/api/auth/logout`);
    if (res.status == 200) {
      redirectLogin();
    } else {
      alert("Hubo un problema al cerrar sesion.")
    }
  } catch (err) {
    alert(err)
  }
}

function redirectLogin() {
  setTimeout(function() {
    window.location.replace("/login");
  }, 2000);
}
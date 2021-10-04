import dotenv from 'dotenv';
import path from 'path';

// Levanto las variables de entrono con .DOTENV
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({
  path: path.resolve(__dirname, './' + process.env.NODE_ENV + '.env')
})

export const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Tiempo de expiración de sesión (En segundos)
export const TIEMPOSESION = parseInt(process.env.TIEMPOSESION) || 300;

// Datos del servidor
export const PORT = process.env.PORT || 8080;
export const URL_BASE = `http://localhost:${PORT}`;

// Conexión a Mongo Atlas
export const  MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ale:ale@cluster0.jcpcl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Datos del administrador
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aleramos.ok@gmail.com';

// Nodemailer, cuenta ETHEREAL
export const ETHEREAL_USER = "donnie.lockman61@ethereal.email";
export const ETHEREAL_PASS = "BY67X7jBAq6Ks1HpYK";

// Exporto un objeto con todas las variables juntas para pasarlo mas facil al front /parametros
export const config = {
  ENVIRONMENT,
  TIEMPOSESION,
  PORT,
  URL_BASE,
  MONGO_URI,
  ADMIN_EMAIL,
  ETHEREAL_USER,
  ETHEREAL_PASS
}
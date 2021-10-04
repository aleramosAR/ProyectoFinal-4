import passport from "passport";
import bCrypt from 'bcrypt';
import User from '../api/models/User.js';
import { Strategy as LocalStrategy} from 'passport-local';
import { formatDate } from './formatDate.js'
import { sendMailEthereal } from './sendMail.js';
import { ADMIN_EMAIL } from '../config.js';
import { storage } from '../utils/index.js';
import { logger } from './index.js';

passport.use('register', new LocalStrategy(
	{ passReqToCallback: true }, (req, username, password, done) => {
    const findOrCreateUser = function() {
      User.findOne({ 'username': username }, (err, user) => {
        if (err) {
          logger.error('Error de registro: ' + err);
          return done(err);
        }
        if (user) {
					logger.warn('El usuario ya existe.');
          return done(null, false, req.flash('message', 'El usuario ya existe.'));
        } else if (password !== req.body.password2) {
					logger.warn('El password no coincide.');
          return done(null, false, req.flash('message', 'El password no coincide.'));
        } else {
					try {
						const admin = (req.body.adminCheck === "true") ? true : false;
						const newuser = new User();
						newuser.username = username;
						newuser.password = createHash(password);
						newuser.email = req.body.email;
						newuser.telefono = req.body.telefono;
						newuser.direccion = req.body.direccion;
						newuser.edad = req.body.edad;
						newuser.admin = admin;
						newuser.foto = "template-avatar.jpg";

						newuser.save(async function(err) {
							if (err) {
								logger.error(`Error grabando al usuario ${newuser.username}`);
								throw err;
							}

							await createEmail(newuser);
							logger.info('Usuario creado');

							storage.set('userID', newuser._id);
							storage.set('ADMIN', newuser.admin);
							return done(null, newuser);
						});
					} catch (error) {
						logger.error(`Se ha producido un error: ${error}`);
						return done(null, false, req.flash('message', `Se ha producido un error: ${error}`));
					}
        }
      });
    }
    process.nextTick(findOrCreateUser);
	})
);

passport.use('login', new LocalStrategy(
	{ passReqToCallback: true }, (req, username, password, done) => {
    User.findOne({ 'username': username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				logger.warn('Usuario no encontrado');
				return done(null, false, req.flash('message', 'Usuario no encontrado'));
			}
			if (!isValidPassword(user, password)) {
				logger.warn('Password invalido');
				return done(null, false, req.flash('message', 'Password inválido'));
			}
			storage.set('userID', user._id);
			storage.set('ADMIN', user.admin);
			
			return done(null, user);
		});
	})
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (username, done) {
	const usuario = User.findOne({ username: username }, (err, user) => {
		if (err) {
			return done('error');
		}
		return done(null, usuario);
	});
});

const createHash = (password) => {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

const isValidPassword = (user, password) => {
	return bCrypt.compareSync(password, user.password);
};

const createEmail = async (newuser) => {
	// Envio de email al administrador
	const asunto = `El usuario ${newuser.username} se registró a las ${formatDate(
		new Date()
	)}`;
	const cuerpo = `
	<strong>Se ha registrado un nuevo usuario con los siguientes datos:</strong>
	<br /><br />
	<strong>Nombre:</strong> ${newuser.username}<br />
	<strong>Email:</strong> ${newuser.email}<br />
	<strong>Teléfono:</strong> ${newuser.telefono}<br />
	<strong>Dirección:</strong> ${newuser.direccion}<br />
	<strong>Edad:</strong> ${newuser.edad}<br /><br />
	<strong>Administrador:</strong> ${newuser.admin}
`;

	await sendMailEthereal({
		to: ADMIN_EMAIL,
		subject: asunto,
		html: cuerpo,
	});
};

export const configPassport = passport;
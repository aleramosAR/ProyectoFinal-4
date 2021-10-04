import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import { logger } from './index.js';
import { MONGO_URI, TIEMPOSESION } from '../config.js';

// CONFIGURACION DE MONGODB ATLAS
const configMongo = async(db) => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
    	useUnifiedTopology: true,
    	useCreateIndex: true,
			useFindAndModify: false
    });
    logger.info("Base de datos conectada!!!");
  } catch (err) {
    logger.error(err.message);
  }
}

const storeData = {
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }),
  secret: 'clavesecreta',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: TIEMPOSESION * 1000 }
};

export { configMongo, storeData };
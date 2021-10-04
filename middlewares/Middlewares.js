import multer from "multer";

export const isAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/unauthorized');
  }
}

export const authAPI = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send({ error: 'No autorizado' });
  }
}

// SUBIR ARCHIVOS ------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
})

export const upload = multer({ storage: storage });
export default class CarritoController {

	getLogout = (req, res) => {		
    req.session.destroy(err => {
      if (err) {
        res.json({ error: 'Hubo un error', body: err })
      } else {
        res.send("Logout");
      }
    })
	};

}
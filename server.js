const expreso = require('expreso');
const ruta = require('ruta');
const aplicación = express();
app.use(express.static(__dirname + '/dist/ecatch-web-config'));
app.get('/*', function(req,res) {
  res.sendFile(ruta.join(__dirname+
    '/dist/<nombre-aplicación>/index.html'));});
app.listen(proceso.env.PORT || 8080);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/views')));


// Importa tus archivos de rutas
const routes = require('./routes'); // No necesitas poner '/routes/index', ya que Node.js buscará automáticamente el archivo index.js


// Usa las rutas
app.use('/', routes); // Todas las rutas en authRoutes estarán bajo /auth

// Ruta dinámica para manejar cualquier URL
app.get('/:page/:id', (req, res) => {
  const { page, id } = req.params;
  res.sendFile(path.join(__dirname, 'public/views', `${page}.html`));
});

// Ruta dinámica para manejar cualquier URL
app.get('/:page', (req, res) => {
  const { page, id } = req.params;
  res.sendFile(path.join(__dirname, 'public/views', `${page}.html`));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const express = require('express');
const router = express.Router();
const db = require('./db'); // Importa la configuración de la base de datos
const bcrypt = require('bcrypt');

// Ruta para el inicio de sesión
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  const query = `
    SELECT id, password FROM perros WHERE email = ?
  `;

  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error en el inicio de sesión:', error);
      res.status(500).send('Error en el inicio de sesión');
    } else if (results.length === 0) {
      res.status(401).send('Correo electrónico no encontrado');
    } else {
      const hashedPassword = results[0].password;
      
      console.log(hashedPassword)
      // Compara la contraseña proporcionada con la contraseña almacenada
      bcrypt.compare(password, hashedPassword, (bcryptError, bcryptResult) => {
        if (bcryptError || !bcryptResult) {
          res.status(401).send('Contraseña incorrecta');
        } else {
          res.status(200).send({msg:'Inicio de sesión exitoso', id: results[0].id});
        }
      });
    }
  });
});


router.post('/register', async (req, res) => {
  
  console.log(req);
  const { dogName, breedId, email, password, age } = req.body;
  const imageUrl = req.body.imageUrl || null; // La imagen puede ser opcional

  const isChecked = req.body.lost === 'true'
  const lost = isChecked ? 0 : 1 ;

  console.log(dogName, breedId, email, password, age)

  try {
    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO perros (imagen_url, nombre, raza_id, email, password, edad, perdido)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [imageUrl, dogName, breedId, email, hashedPassword, age, lost], (error, results) => {
      if (error) {
        console.error('Error en el registro:', error);
        res.status(500).send('Error en el registro');
      } else {
        res.status(200).send('Perro registrado exitosamente');
      }
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).send('Error en el registro');
  }
});



// Ruta para obtener el perfil de un perro
router.get('/info/:id', (req, res) => {
  const dogId = req.params.id;

  const query = `
    SELECT p.nombre, r.nombre AS raza, p.edad, p.imagen_url -- Agrega más campos
    FROM perros p
    JOIN razas r ON p.raza_id = r.id
    WHERE p.id = ?
  `;

  db.query(query, [dogId], (error, results) => {
    if (error) {
      console.error('Error al obtener el perfil del perro:', error);
      res.status(500).send('Error al obtener el perfil del perro');
    } else if (results.length === 0) {
      res.status(404).send('Perro no encontrado');
    } else {
      const dogProfile = results;
      res.status(200).json(dogProfile);
    }
  });
});

// Ruta para obtener el perfil de un perro
router.get('/allinfo', (req, res) => {

  const query = `
    SELECT p.nombre, r.nombre AS raza, p.edad, p.imagen_url -- Agrega más campos
    FROM perros p
    JOIN razas r ON p.raza_id = r.id
    WHERE p.perdido = 0
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener el perfil del perro:', error);
      res.status(500).send('Error al obtener el perfil del perro');
    } else if (results.length === 0) {
      res.status(404).send('Perro no encontrado');
    } else {
      const dogProfile = results;
      res.status(200).json(dogProfile);
    }
  });
});

router.get('/breeds', (req, res) => {
  const query = `SELECT id, nombre FROM razas`; // Ajusta la consulta según tu esquema de base de datos
  
  db.query(query, (error, breeds) => {
    if (error) {
      console.error('Error al obtener las opciones de raza:', error);
      res.status(500).send('Error al obtener las opciones de raza');
    } else {
      res.json(breeds);
    }
  });
});

module.exports = router;
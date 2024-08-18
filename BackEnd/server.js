const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
dotenv.config();

const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', express.static(path.join(__dirname, 'api')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './api/images/upload'); 
  },
  filename: function (req, file, cb) {
    cb(null, `image${path.extname(file.originalname)}`); 
  }
});


const upload = multer({ storage: storage });

app.post('/upload/:id', upload.single('fileFieldName'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});
// app.post('/upload/:id', upload.single('fileFieldName'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }
//     res.send(`File uploaded successfully: ${req.file.filename}`);
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).send("Error uploading file.");
//   }
// });
app.post('/upload/:id', upload.single('fileFieldName'), (req, res) => {
  try {
    // Assurez-vous que le fichier a été uploadé avec succès
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', fileName: req.file.filename });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ error: 'Error uploading file', details: error.message });
  }
});
app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" encType="multipart/form-data">
      <input type="file" name="fileFieldName" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// STRIPE
app.post('/create-checkout-session', async (req, res) => {
  const { items, id_customers } = req.body;

  // Vérifier et afficher les paramètres reçus
  console.log('Received items:', items);
  console.log('Received id_customers:', id_customers);

  if (!items || !id_customers) {
    console.error('Missing required parameters');
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.id,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      client_reference_id: id_customers,
    });
    console.log('Checkout session created:', session);

    res.json({ 
      id: session.id,
      clientSecret: session.client_secret,
      stripeId: session.payment_intent,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/create-payment-intent', async (req, res) => {
  const { amount } = req.query;

  if (!amount) {
    return res.status(400).json({ error: 'Missing amount parameter' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route Webhook pour recevoir les événements de Stripe
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('Webhook event constructed:', event);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session);

      const id_customers = session.client_reference_id;
      if (!id_customers) {
        console.error('Missing client_reference_id in session');
        return response.status(400).send('Missing client_reference_id');
      }

      const totalPrice = session.amount_total / 100;
      const receiptDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const orderStatus = 'Payée';

      try {
        const orderId = await insertOrder(id_customers, session.display_items.length, totalPrice, receiptDate, orderStatus);

        const orderDetails = session.display_items.map(item => ({
          id_orders: orderId,
          id_lessons: item.custom.name,
          qty: item.quantity,
          totalPrice: item.amount_subtotal / 100,
          statut: 1,
        }));

        console.log('Order Details:', orderDetails);

        await insertOrderDetails(orderId, orderDetails);
        response.json({ received: true });
      } catch (error) {
        console.error('Error updating database:', error);
        response.status(500).send('Internal Server Error');
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      response.send().end();
  }
});

function insertOrder(id_customers, totalLessons, totalPrice, receiptDate, orderStatus) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO orders (id_customers, totalLessons, totalPrice, receiptDate, ordersStatut)
      VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [id_customers, totalLessons, totalPrice, receiptDate, orderStatus], (error, results) => {
      if (error) {
        console.error('Error inserting order:', error);
        return reject(error);
      }
      console.log('Order inserted:', results.insertId);
      resolve(results.insertId);
    });
  });
}

function insertOrderDetails(orderId, orderDetails) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO ordersDetails (id_orders, id_lessons, qty, totalPrice, statut)
      VALUES ?`;

    const values = orderDetails.map(detail => [
      detail.id_orders,
      detail.id_lessons,
      detail.qty,
      detail.totalPrice,
      detail.statut,
    ]);

    connection.query(query, [values], (error, results) => {
      if (error) {
        console.error('Error inserting order details:', error);
        return reject(error);
      }
      console.log('Order details inserted:', results);
      resolve();
    });
  });
}

  

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// CONTACTS

app.get("/contacts", (req, res) => {
  connection.query("SELECT * FROM contacts", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get("/contacts/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM contacts WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/contacts", (req, res) => {
  const { name, email, id_subjects, message } = req.body;
  connection.query(
    "INSERT INTO contacts (name, email, id_subjects, message) VALUES (?,?,?,?)",
    [name, email, id_subjects, message],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
app.delete("/contacts/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM contacts WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send("Contact deleted successfully");
    }
  );
});


// SUBJECT

app.get("/subjects", (req, res) => {
  connection.query("SELECT * FROM subjects", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});
app.get("/subjects/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM subjects WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
app.post("/subjects", (req, res) => {
  const { name } = req.body;
  connection.query(
    "INSERT INTO subjects (name) VALUES (?)",
    [name],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
app.get("/formats", (req, res) => {
  connection.query("SELECT * FROM formats", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});



// CUSTOMERS

app.put("/customer/:id/email", async (req, res) => {
  const { id } = req.params;
  const {
    email,
    address,
    additionalAddress,
    zipCode,
    city,
    country,
    tel,
  } = req.body;

  console.log(`Request to update email for user ID: ${id}`);
  console.log(`New email: ${email}`);
  console.log(
    `Address: ${address}, Additional Address: ${additionalAddress}, Zip Code: ${zipCode}, City: ${city}, Country: ${country}, Tel: ${tel}`
  );

  try {
    const [customer] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM customers WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error("Erreur lors de la requête de sélection:", error);
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    if (!customer) {
      console.log("Customer not found");
      return res.status(404).send("Customer not found");
    }

    console.log(`Customer retrieved: ${JSON.stringify(customer)}`);

    const [countryRecord] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT id FROM countries WHERE name = ?",
        [country],
        (error, results) => {
          if (error) {
            console.error("Erreur lors de la requête de sélection du pays:", error);
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    if (!countryRecord) {
      console.log("Country not found");
      return res.status(404).send("Country not found");
    }

    const id_countries = countryRecord.id;

    // Mise à jour de l'email dans la table customers
    const updateCustomerQuery = `
      UPDATE customers 
      SET email = ? 
      WHERE id = ?`;

    await new Promise((resolve, reject) => {
      connection.query(
        updateCustomerQuery,
        [email, id],
        (error, results) => {
          if (error) {
            console.error(
              "Erreur lors de la mise à jour des informations du client:",
              error
            );
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    // Vérification de l'existence de l'entrée dans customersDetails
    const [details] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM customersDetails WHERE id_customers = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error("Erreur lors de la vérification des détails du client:", error);
            return reject(error);
          }
          resolve(results);
        }
      );
    });
    if (details) {
      const updateDetailsQuery = `
        UPDATE customersDetails 
        SET address = ?, additionalAddress = ?, zipCode = ?, city = ?, id_countries = ?, tel = ?
        WHERE id_customers = ?`;
      await new Promise((resolve, reject) => {
        connection.query(
          updateDetailsQuery,
          [address, additionalAddress, zipCode, city, id_countries, tel, id],
          (error, results) => {
            if (error) {
              console.error("Erreur lors de la mise à jour des détails du client:", error);
              return reject(error);
            }
            resolve(results);
          }
        );
      });
    } else {
      const insertDetailsQuery = `
        INSERT INTO customersDetails (id_customers, address, additionalAddress, zipCode, city, id_countries, tel)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await new Promise((resolve, reject) => {
        connection.query(
          insertDetailsQuery,
          [id, address, additionalAddress, zipCode, city, id_countries, tel],
          (error, results) => {
            if (error) {
              console.error("Erreur lors de l'insertion des détails du client:", error);
              return reject(error);
            }
            resolve(results);
          }
        );
      });
    }

    console.log("Profile updated successfully");
    res.send("Profil mis à jour avec succès");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).send("Erreur lors de la mise à jour du profil");
  }
});
app.put("/customer/:id/details", async (req, res) => {
  const { id } = req.params;
  const {
    address,
    additionalAddress,
    zipCode,
    city,
    country,
    tel,
  } = req.body;

  try {
    const [countryRecord] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT id FROM countries WHERE name = ?",
        [country],
        (error, results) => {
          if (error) {
            console.error("Erreur lors de la requête de sélection du pays:", error);
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    if (!countryRecord) {
      console.log("Country not found");
      return res.status(404).send("Country not found");
    }

    const id_countries = countryRecord.id;
    const [details] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM customersDetails WHERE id_customers = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error("Erreur lors de la vérification des détails du client:", error);
            return reject(error);
          }
          resolve(results);
        }
      );
    });
    if (details) {
      const updateDetailsQuery = `
        UPDATE customersDetails 
        SET address = ?, additionalAddress = ?, zipCode = ?, city = ?, id_countries = ?, tel = ?
        WHERE id_customers = ?`;
      await new Promise((resolve, reject) => {
        connection.query(
          updateDetailsQuery,
          [address, additionalAddress, zipCode, city, id_countries, tel, id],
          (error, results) => {
            if (error) {
              console.error("Erreur lors de la mise à jour des détails du client:", error);
              return reject(error);
            }
            resolve(results);
          }
        );
      });
    } else {
      const insertDetailsQuery = `
        INSERT INTO customersDetails (id_customers, address, additionalAddress, zipCode, city, id_countries, tel)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await new Promise((resolve, reject) => {
        connection.query(
          insertDetailsQuery,
          [id, address, additionalAddress, zipCode, city, id_countries, tel],
          (error, results) => {
            if (error) {
              console.error("Erreur lors de l'insertion des détails du client:", error);
              return reject(error);
            }
            resolve(results);
          }
        );
      });
    }

    console.log("Profile details updated successfully");
    res.send("Détails du profil mis à jour avec succès");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des détails du profil:", error);
    res.status(500).send("Erreur lors de la mise à jour des détails du profil");
  }
});


app.get("/customer/:id", (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT 
  customers.id, 
  customers.lastname, 
  customers.firstname, 
  customers.email, 
  customers.password, 
  customers.createdAt, 
  customers.id_roles, 
  customers.id_statuts, 
  customersDetails.address, 
  customersDetails.additionalAddress, 
  customersDetails.zipCode, 
  customersDetails.city, 
  countries.name AS country, 
  customersDetails.tel
FROM customers 
LEFT JOIN customersDetails ON customers.id = customersDetails.id_customers
LEFT JOIN countries ON customersDetails.id_countries = countries.id
WHERE customers.id = ?
  `;
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send("Internal Server Error");
    }

    if (results.length === 0) {
      console.error(`Customer not found with ID: ${id}`);
      return res.status(404).send("Customer not found");
    }

    res.send(results[0]);
  });
});

const updatePasswords = async () => {
  connection.query(
    "SELECT id, password FROM customers",
    async (error, results) => {
      if (error) throw error;

      for (const user of results) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        connection.query(
          "UPDATE customers SET password = ? WHERE id = ?",
          [hashedPassword, user.id],
          (error, results) => {
            if (error) {
              console.error(
                `Error updating password for user ID ${user.id}:`,
                error
              );
            } else {
              console.log(`Password updated for user ID ${user.id}`);
            }
          }
        );
      }
    }
  );
};

app.post("/customers/register", (req, res) => {
  const { lastname, firstname, email, password } = req.body;
  const saltRounds = 10;

  connection.query(
    "SELECT COUNT(*) AS count FROM customers WHERE email = ?",
    [email],
    (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Erreur lors de la vérification de l'email:", selectErr);
        return res
          .status(500)
          .send("Erreur lors de la vérification de l'email");
      }

      const emailExists = selectResults[0].count > 0;
      if (emailExists) {
        return res.status(400).send("Cette adresse e-mail est déjà utilisée");
      }

      bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Erreur lors du hachage du mot de passe:", hashErr);
          return res.status(500).send("Erreur lors du hachage du mot de passe");
        }

        connection.query(
          "INSERT INTO customers (lastname, firstname, email, password) VALUES (?, ?, ?, ?)",
          [lastname, firstname, email, hashedPassword],
          (insertErr, insertResults) => {
            if (insertErr) {
              console.error(
                "Erreur lors de l'insertion des données:",
                insertErr
              );
              return res
                .status(500)
                .send("Erreur lors de l'insertion des données");
            }
            res.send("L'utilisateur a été ajouté avec succès");
          }
        );
      });
    }
  );
});

app.get("/customers", (req, res) => {
  connection.query("SELECT * FROM customers", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/customers/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM customers WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/customers/login", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    "SELECT * FROM customers WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error("Erreur lors de la requête SQL", error);
        return res
          .status(500)
          .json({ success: false, message: "Erreur interne du serveur" });
      }
      if (results.length > 0) {
        const validPassword = await bcrypt.compare(
          password,
          results[0].password
        );
        if (validPassword) {
          // Générer le token JWT
          const token = jwt.sign(
            { id: results[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.json({
            success: true,
            message: "Connexion réussie avec succès",
            token,
            userId: results[0].id,
            lastname: results[0].lastname, // Recupere le lastname dans la réponse
            firstname: results[0].firstname, // Ajoute le firstname dans la réponse
            id_roles: results[0].id_roles, // On recupére dans la res le rôle de user
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "Mot de passe incorrect" });
        }
      } else {
        res.status(401).json({ success: false, message: "Email incorrect" });
      }
    }
  );
});

app.post("/customers/logout", (req, res) => {
  res.json({ success: true, message: "Déconnexion réussie" });
});
app.put("/customers/:id", (req, res) => {
  const { id_roles } = req.body;
  const { id } = req.params;

  connection.query(
    "UPDATE customers SET id_roles = ? WHERE id = ?",
    [id_roles, id],
    (error, results) => {
      if (error) throw error;
      res.send("Contact updated successfully");
    }
  );
});

app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM customers WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send("Contact deleted successfully");
    }
  );
});

app.put("/customer/:id/email", async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    newPassword,
    address,
    additionalAddress,
    zipCode,
    city,
    id_countries,
    tel,
  } = req.body;

  try {
    const [customer] = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM customers WHERE id = ?",
        [id],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    const validPassword = await bcrypt.compare(password, customer.password);
    if (!validPassword) {
      return res.status(401).send("Mot de passe incorrect");
    }

    const hashedNewPassword = newPassword
      ? await bcrypt.hash(newPassword, 10)
      : customer.password;

    await new Promise((resolve, reject) => {
      connection.query(
        "UPDATE customers SET email = ?, password = ? WHERE id = ?",
        [email, hashedNewPassword, id],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
    await new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO customersDetails (id_customers, address, additionalAddress, zipCode, city, id_countries, tel) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE address = VALUES(address), additionalAddress = VALUES(additionalAddress), zipCode = VALUES(zipCode), city = VALUES(city), id_countries = VALUES(id_countries), tel = VALUES(tel)",
        [id, address, additionalAddress, zipCode, city, id_countries, tel],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });

    res.send("Profil mis à jour avec succès");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).send("Erreur lors de la mise à jour du profil");
  }
});

// LESSONS

app.post("/lessons", upload.single('img'), (req, res) => {
  const {
    title,
    underTitle,
    description,
    bases,
    lessonTime,
    totalPrice,
    maxPlaces,
    id_levels,
    id_formats,
    id_technologies,
    reference,
    statut,
  } = req.body;
  
  const img = req.file ? req.file.filename : 'default.jpg'; 
  const altImg = req.body.altImg;


  connection.query(
    "INSERT INTO lessons (title, underTitle, description, bases, lessonTime, totalPrice, maxPlaces, img, altImg, id_levels, id_formats,reference, id_technologies, statut) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?, ?)",
    [
      title,
      underTitle,
      description,
      bases,
      lessonTime,
      totalPrice,
      maxPlaces,
      img,
      altImg,
      id_levels,
      id_formats,
      reference,
      id_technologies,
      statut,
    ],
    (error, results) => {
      if (error) {
        console.error("Erreur lors de l'ajout de la leçon :", error);
        return res.status(500).send("Erreur lors de l'ajout de la leçon");
      }
      res.send("Leçon ajoutée avec succès");
    }
  );
});

app.get("/lessons", (req, res) => {
  connection.query(
    `SELECT 
    lessons.id,
    lessons.title, lessons.underTitle, lessons.img, lessons.altImg, lessons.totalPrice,lessons.statut,
    levels.level,
    technologies.statut AS etat
    FROM lessons 
    INNER JOIN technologies
    ON lessons.id_technologies = technologies.id
    INNER JOIN levels ON levels.id = lessons.id_levels
    WHERE lessons.statut = 1
    AND technologies.statut = 1`,
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/lessons/:id/levels", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT lessons.title, lessons.underTitle, levels.level FROM lessons INNER JOIN levels ON levels.id = lessons.id_levels WHERE lessons.id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
// Mise à jour du contenu de la leçon
app.get('/lessonmodifier/:id', (req, res) => {
      const { id } = req.params;
      connection.query('SELECT * FROM lessons WHERE id = ?', [id], (error, results) => {
          if (error) throw error;
          res.send(results);
      });
      console.log(req.body);
  });
   

app.get("/lessons/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM lessons WHERE id_technologies = ? AND statut = 1 ",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
app.get("/lesson/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM lessons WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

// TECHNOLOGIE

app.get("/technologies", (req, res) => {
  connection.query(
    "SELECT * FROM technologies WHERE statut =1",
    (error, results) => {
      console.log(results);
      if (error) throw error;
      res.send(results);
    }
  );
});
app.get("/technologies/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM technologies WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});
app.post("/technologies", (req, res) => {
  const { name, technoPicture, technoAlt, statut } = req.body;
  connection.query(
    "INSERT INTO technologies (name, technoPicture, technoAlt, statut) VALUES (?,?,?,?)",
    [name, technoPicture, technoAlt, statut],
    (error, results) => {
      if (error) throw error;
      res.send("Technology added successfully");
    }
  );
});

app.put("/technologies/:id", (req, res) => {
  const { id } = req.params;
  const { name, technoPicture, technoAlt, statut } = req.body;
  connection.query(
    "UPDATE technologies SET name = ?, technoPicture = ?, technoAlt = ?, statut = ? WHERE id = ?",
    [name, technoPicture, technoAlt, statut, id],
    (error, results) => {
      if (error) throw error;
      res.send("Technology updated successfully");
    }
  );
});

app.delete("/technologies/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "DELETE FROM technologies WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send("Technology deleted successfully");
    }
  );
});

// LEVELS

app.get("/levels", (req, res) => {
  connection.query("SELECT * FROM levels", (error, results) => {
    if (error) throw error;
    res.send(results);
  });

  app.post("/levels", (req, res) => {
    const { level, statut } = req.body;
    connection.query(
      "INSERT INTO levels (level, statut) VALUES (?,?)",
      [level, statut],
      (error, results) => {
        if (error) throw error;
        res.send("Level added successfully");
      }
    );
  });
});

app.get("/levels/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM levels WHERE id = ?",
    [id],
    (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

// change statut

app.put("/changelessonstatut/:id", (req, res) => {
  const { statut } = req.body;
  const { id } = req.params;
  console.log(req.params);
  connection.query(
    "UPDATE lessons SET statut = ? WHERE id = ?",
    [statut, id],
    (error, results) => {
      if (error) throw error;
      res.send("Lesson updated successfully");
    }
  );
  console.log(req.body);
});
app.put("/changetechnologiestatut/:id", (req, res) => {
  const { statut } = req.body;
  const { id } = req.params;
  console.log(req.params);
  connection.query(
    "UPDATE technologies SET statut = ? WHERE id = ?",
    [statut, id],
    (error, results) => {
      if (error) throw error;
      res.send("Technologie updated successfully");
    }
  );
  console.log(req.body);
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

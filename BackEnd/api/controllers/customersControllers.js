require('dotenv').config();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

const getLogin = (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, passwordMatch) => {
                if (err) throw err;
                if (passwordMatch) {
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.json({ msg: "Bienvenue", token });
                } else {
                    res.status(401).json({ msg: "Mot de passe incorrect" });
                }
            });
        } else {
            res.status(404).json({ msg: "Utilisateur non trouvé" });
        }
    });
};

const getAllCustomers = (req, res) => {
    connection.query('SELECT * FROM customers', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
};

const getOneCustomers = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM customers WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
};

const createOneCustomers = (req, res) => {
    const { lastname, firstname, email, password } = req.body;

    // Générer un sel pour le hachage
    const saltRounds = 10;

    // Hacher le mot de passe
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe:', err);
            return res.status(500).send('Erreur lors du hachage du mot de passe');
        }

        // Insérer les données dans la base de données avec le mot de passe haché
        connection.query('INSERT INTO customers (lastname, firstname, email, password) VALUES (?, ?, ?, ?)', [lastname, firstname, email, hashedPassword], (error, results) => {
            if (error) {
                console.error('Erreur lors de l\'insertion des données:', error);
                return res.status(500).send('Erreur lors de l\'insertion des données');
            }
            res.send(`L'utilisateur a été ajouté avec succès`);
        });
    });
};

const updateOneCustomers = (req, res) => {
    const { lastname, firstname, email, password, id_roles } = req.body;
    const { id } = req.params;

    connection.query('UPDATE customers SET lastname = ?, firstname = ?, email = ?, password = ?, id_roles = ? WHERE id = ?', [lastname, firstname, email, password, id_roles, id], (error, results) => {
        if (error) throw error;
        res.send('Utilisateur mis à jour avec succes');
    });
};

const deleteOneCustomers = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM customers WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send('Utilisateur supprimé avec succes');
    });
};


module.exports = {
    getAllCustomers,
    getOneCustomers,
    createOneCustomers,
    updateOneCustomers,
    deleteOneCustomers,
    getLogin,
};
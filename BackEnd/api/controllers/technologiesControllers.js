
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'projet'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});
const getAllTechnologies = (req, res) => {
    connection.query('SELECT * FROM technologies', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
};

const getOneTechnology = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM technologies WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
};

const createOneTechnology = (req, res) => {
    const { name } = req.body;
    connection.query('INSERT INTO technologies (name) VALUES (?)', [name], (error, results) => {
        if (error) throw error;
        res.send('Technology added successfully');
    });
};

const updateOneTechnology = (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    connection.query('UPDATE technologies SET name = ? WHERE id = ?', [name, id], (error, results) => {
        if (error) throw error;
        res.send('Technology updated successfully');
    });
};

const deleteOneTechnology = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM technologies WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send('Technology deleted successfully');
    });
};

module.exports = {
    getAllTechnologies,
    getOneTechnology,
    createOneTechnology,
    updateOneTechnology,
    deleteOneTechnology
};


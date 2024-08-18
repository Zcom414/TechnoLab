
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

const getAllLessons = (req, res) => {
    connection.query('SELECT * FROM lessons', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
};

const getOneLesson = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM lessons WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
};

const createOneLesson = (req, res) => {
    const { name } = req.body;
    connection.query('INSERT INTO lessons (name) VALUES (?)', [name], (error, results) => {
        if (error) throw error;
        res.send('Lesson added successfully');
    });
};

const updateOneLesson = (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    connection.query('UPDATE lessons SET name = ? WHERE id = ?', [name, id], (error, results) => {
        if (error) throw error;
        res.send('Lesson updated successfully');
    });
};

const deleteOneLesson = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM lessons WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send('Lesson deleted successfully');
    });
};

module.exports = {
    getAllLessons,
    getOneLesson,
    createOneLesson,
    updateOneLesson,
    deleteOneLesson
};
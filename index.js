var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// default route
app.get('/', function (req, res) {
  return res.send({ error: true, message: 'hello' })
});

// connection configurations
var dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node_restapi'
});
// connect to database
dbConn.connect();

// Retrieve All items
app.get('/items', (req, res) => {
  dbConn.query('SELECT * FROM items', (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'users list.' });
  });
});

// Retrieve all users
app.get('/users', function (req, res) {
  dbConn.query('SELECT * FROM users', (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'users list.' });
  });
});

// Retrieve user with id 
app.get('/user/:id', (req, res) => {
  let user_id = req.params.id;
  if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  dbConn.query('SELECT * FROM users where id=?', user_id, (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results[0], message: 'users list.' });
  });
});

// Add a new user
app.post('/user', (req, res) => {
  let user = req.body.user;
  if (!user) {
    return res.status(400).send({ error: true, message: 'Please provide user' });
  }
  dbConn.query("INSERT INTO users SET ? ", { user: user }, (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
  });
});

//  Update user with id
app.put('/user', (req, res) => {
  let user_id = req.body.user_id;
  let user = req.body.user;
  if (!user_id || !user) {
    return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
  }
  dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
  });
});

//  Delete user
app.delete('/user', (req, res) => {
  let user_id = req.body.user_id;
  if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  dbConn.query('DELETE FROM users WHERE id = ?', [user_id], (error, results, fields) => {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
  });
});

// set port
app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});
module.exports = app;
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();  


// Create a connection object
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    return console.log('Error connecting to the database:', err);
    
  }
  console.log('Connected to the MySQL database.');
});

//  1: Retrieve all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving patients');
    }
    res.json(results);
  });
});

//  2: Retrieve all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving providers');
    }
    res.json(results);
  });
});

//  3: Filter patients by First Name
app.get('/patients/search', (req, res) => {
  const { first_name } = req.query;  // Get first_name from query params
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  connection.query(sql, [first_name], (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving patients by first name');
    }
    res.json(results);
  });
});

//  4: Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const { provider_specialty } = req.query;  // Get provider_specialty from query params
  const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  connection.query(sql, [provider_specialty], (err, results) => {
    if (err) {
      return res.status(500).send('Error retrieving providers by specialty');
    }
    res.json(results);
  });
});

// Listen to the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



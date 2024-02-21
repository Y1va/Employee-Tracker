const inquirer = require('inquirer');
const mysql = require('mysql2');


// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_tracker',
});

// Connect to the database
connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to the employee_tracker database');
  await startApp();
});

// Prompt the user to choose an action

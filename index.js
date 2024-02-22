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
async function startApp() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ]);
    // answer.action is compared with the values of case
    switch (answer.action) {
    case 'View all departments':
        await viewDepartments();
        break;
    case 'View all roles':
        await viewRoles();
        break;
    case 'View all employees':
        await viewEmployees();
        break;
    case 'Add a department':
        await addDepartment();
        break;
    case 'Add a role':
        await addRole();
        break;
    case 'Add an employee':
        await addEmployee();
        break;
    case 'Update an employee role':
        await updateEmployeeRole();
        break;
        // Ends the connection
    case 'Exit':
        connection.end();
        break;
    default:
      // If answer.action doesn't match any case, it will log the following and calls the startApp function
        console.log('Invalid action. Please try again.');
        await startApp();
        break;
    }
  } catch (err) {
      console.error('An error occured:', err);
      connection.end();
      process.exit(1);
  }
}


// View all departments function
async function viewDepartments() {
  // SQL query that selects all records from the departments table
  const query = 'SELECT * FROM departments';
  try {
    const [rows] = await connection.promise().query(query);
    console.table(rows);
  } catch (err) {
    console.error('An error occured while retrieving departments', err);
  }
  // await is used to wait for startApp function to complete before continuing
  // used to wait for the promise to complete from the async function before continuing
  await startApp();
}


// View all roles function
async function viewRoles() {
  const query = `
  SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles
  INNER JOIN departments ON roles.department_id = departments.id`;
  try {
    const [rows] = await connection.promise().query(query);
    console.table(rows);
  } catch (err) {
    console.error('An error occured while retrieving roles', err);
  }
  await startApp();
}


// View all employees function
async function viewEmployees() {
  const query = `
  SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM employees
  INNER JOIN roles ON employees.role_id = roles.id
  INNER JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees AS managers ON employees.manager_id = managers.id
  `;
  try {
    const [rows] = await connection.promise().query(query);
    console.table(rows);
  } catch (err) {
    console.error('An error occured whilst retrieving employees', err);
  }
  await startApp();
}


// Add department function
async function addDepartment() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate: (input) => {
          if (input.trim() === '') {
            return 'Please enter a valid department name.';
          }
          return true;
        },
      },
    ]);

    const query = 'INSERT INTO departments SET ?';
    await connection.promise().query(query, { name: answer.name });
    console.log('Department added successfully!');
  } catch (err) {
    console.error('An error occured whilst trying to add a department', err);
  }
  await startApp();
}


// Add a role function
 async function addRole() {
  try {
    const [departments] = await connection.promise().query('SELECT * FROM departments');
    const choices = departments.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the name of the role:',
        validate: (input) => {
          if (input.trim() === '') {
            return 'Please enter a valid role name.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the role:',
        validate: (input) => {
          if (isNaN(input)) {
            return 'Please enter a valid salary.'
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for the role:', choices,
      },
    ]);

    const query = 'INSERT INTO roles SET ?';
    await connection.promise().query(query, {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentId,
    });
    console.log('Role has been added sucessfully!');
  } catch (err) {
    console.error('An error occured while adding a role');
  }
  await startApp();
 }


//  Add employee function
async function addEmployee() {
  try {
    const [roles] = await connection.promise().query('SELECT * FROM roles');
    const [managers] = await connection.promise().query('SELECT * FROM employees WHERE manager_id IS NULL');

    const choices = [
      { name: 'None', value: null },
      ...managers.map((manager) => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id,
      })),
    ];

    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employees first name:",
        validate: (input) => {
          if (input.trim() === '') {
            return "Please enter the employees first name.";
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employees last name:",
        validate: (input) => {
          if (input.trim() === '') {
            return "Please enter the employees last name.";
          }
          return true;
        },
      },
      {
        
      }
    ])
  } catch (err) {
    
  }
}
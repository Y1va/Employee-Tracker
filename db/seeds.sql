-- Use employee tracker database from schema file
USE employee_tracker;

SET FOREIGN_KEY_CHECKS = 0;


-- Seed data into department table
INSERT INTO departments (name) VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');


-- Seed data into roles table
INSERT INTO roles (title, salary, department_id) VALUES
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4),
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Account Manager', 160000, 2),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3);


-- Seed data into employee table
INSERT INTO employees (
    first_name,
    last_name,
    role_id,
    manager_id
) VALUES  
    ('John', 'Doe', 4, 2),
    ('Mike', 'Chan', 3 NULL),
    ('Ashley', 'Rodriguez', 6, 5),
    ('Kevin', 'Tupik', 6, 5),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 8, NULL),
    ('Sarah', 'Lourd', 2, NULL);



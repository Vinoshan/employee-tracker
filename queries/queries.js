const connection = require('../db/db');

// Retrieve all departments from the database
function getAllDepartments() {
  return connection.execute('SELECT * FROM department')
    .catch(err => {
      console.error('Error fetching departments:', err);
      throw err;
    });
}

// Retrieve all roles from the database
function getAllRoles() {
  return connection.execute('SELECT * FROM role')
    .catch(err => {
      console.error('Error fetching roles:', err);
      throw err;
    });
}

// Retrieve all employees from the database
function getAllEmployees() {
  return connection.execute('SELECT * FROM employee')
    .catch(err => {
      console.error('Error fetching employees:', err);
      throw err;
    });
}

// Add a new department to the database
function addDepartment(departmentName) {
  return connection.execute('INSERT INTO department (name) VALUES (?)', [departmentName])
    .catch(err => {
      console.error('Error adding department:', err);
      throw err;
    });
}

// Add a new role to the database
function addRole(title, salary, departmentId) {
  return connection.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId])
    .catch(err => {
      console.error('Error adding role:', err);
      throw err;
    });
}

// Add a new employee to the database
function addEmployee(firstName, lastName, roleId, managerId) {
  return connection.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId])
    .catch(err => {
      console.error('Error adding employee:', err);
      throw err;
    });
}

// Update an employee's role in the database
function updateEmployeeRole(employeeId, newRoleId) {
  return connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId])
    .catch(err => {
      console.error('Error updating employee role:', err);
      throw err;
    });
}

// Remove an employee from the database
function removeEmployee(employeeId) {
  const query = 'DELETE FROM employee WHERE id = ?';

  return connection.execute(query, [employeeId]);
}

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  removeEmployee
};

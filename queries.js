const connection = require('./db');

function getAllDepartments(){
  return connection.promise().query('SELECT * FROM department');
}

function getAllRoles(){
  return connection.promise().query('SELECT * FROM role');
}

function getAllEmployees(){
  return connection.promise().query('SELECT * FROM employee');
}

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
}
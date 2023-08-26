const inquirer = require('inquirer');
const clear = require('clear');
const pool = require('./db/db');
const {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  removeEmployee,
} = require('./queries/queries');

function mainMenu() {
  clear();
  // Prompt the user to select an option from the main menu
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menuChoice',
        message: 'Select an option:',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Remove an employee',
          'Quit'
        ],
      },
    ])
    .then((answers) => {
      // Define actions corresponding to user's choices
      const actions = {
        'View all departments': viewDepartments,
        'View all roles': viewRoles,
        'View all employees': viewEmployees,
        'Add a department': promptAndAddDepartment,
        'Add a role': promptAndAddRole,
        'Add an employee': promptAndAddEmployee,
        'Update an employee role': promptAndUpdateEmployeeRole,
        'Remove an employee': promptAndRemoveEmployee,
        'Quit': () => {
          console.log('Goodbye!');
          process.exit();
        }
      };
      // Perform the selected action or display error for invalid choice
      const selectedAction = actions[answers.menuChoice];
      if (selectedAction) {
        selectedAction();
      } else {
        console.log('Invalid choice');
      }
    });
}

// Start the application by calling the mainMenu function
mainMenu();

// Function to display all departments
function viewDepartments() {
  // Retrieve departments from the database
  getAllDepartments()
    .then(([rows, fields]) => {
      const departments = rows;
      console.log('\nDepartments:\n');
      // Display department information
      departments.forEach((department) => {
        console.log(`ID: ${department.id} | Name: ${department.name}`);
      });
      // Prompt the user to go back to the menu or quit
      promptBackToMenuOrQuit();
    })
    .catch((error) => {
      console.error('Error retrieving departments:', error);
      promptBackToMenuOrQuit();
    });
}

// Function to display all roles
function viewRoles() {
  // Retrieve roles from the database
  getAllRoles()
    .then(([rows, fields]) => {
      const roles = rows;
      console.log('\nRoles:\n');
      // Display role information
      roles.forEach((role) => {
        console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
      });
      // Prompt the user to go back to the menu or quit
      promptBackToMenuOrQuit();
    })
    .catch((error) => {
      console.error('Error retrieving roles:', error);
      promptBackToMenuOrQuit();
    });
}

// Function to display all employees
function viewEmployees() {
  // Retrieve employees from the database
  getAllEmployees()
    .then(([rows, fields]) => {
      const employees = rows;
      console.log('\nEmployees:\n');
      // Display employee information
      employees.forEach((employee) => {
        console.log(`ID: ${employee.id} | First Name: ${employee.first_name} | Last Name: ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
      });
      // Prompt the user to go back to the menu or quit
      promptBackToMenuOrQuit();
    })
    .catch((error) => {
      console.error('Error retrieving employees:', error);
      promptBackToMenuOrQuit();
    });
}

// Function to prompt user and add a department
function promptAndAddDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
      validate: (input) => {
        if (input.trim() === '') {
          return 'Department name cannot be empty';
        }
        return true;
      },
    },
  ])
    .then((answers) => {
      // Add the department to the database
      addDepartment(answers.departmentName)
        .then(() => {
          console.log(`Department "${answers.departmentName}" added successfully.`);
        })
        .catch((error) => {
          console.error('Error adding department:', error);
        })
        .finally(promptBackToMenuOrQuit);
    });
}

// Function to prompt user and add a role
function promptAndAddRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleTitle',
      message: 'Enter the title of the role:',
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'Enter the salary of the role:',
    },
    {
      type: 'input',
      name: 'roleDepartmentId',
      message: 'Enter the department ID for the role:',
    },
  ])
    .then((answers) => {
      const { roleTitle, roleSalary, roleDepartmentId } = answers;
      // Add the role to the database
      addRole(roleTitle, roleSalary, roleDepartmentId)
        .then(() => {
          console.log(`Role "${roleTitle}" added successfully.`);
        })
        .catch((error) => {
          console.error('Error adding role:', error);
        })
        .finally(promptBackToMenuOrQuit);
    });
}

// Function to prompt user and add an employee
function promptAndAddEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:',
    },
    {
      type: 'input',
      name: 'roleId',
      message: 'Enter the role ID for the employee:',
    },
    {
      type: 'input',
      name: 'managerId',
      message: 'Enter the manager ID for the employee (or leave empty if none):',
    },
  ])
    .then((answers) => {
      const { firstName, lastName, roleId, managerId } = answers;
      // Add the employee to the database
      addEmployee(firstName, lastName, roleId, managerId)
        .then(() => {
          console.log(`Employee "${firstName} ${lastName}" added successfully.`);
        })
        .catch((error) => {
          console.error('Error adding employee:', error);
        })
        .finally(promptBackToMenuOrQuit);
    });
}

// Function to prompt user and update an employee's role
function promptAndUpdateEmployeeRole() {
  // Retrieve employees from the database
  getAllEmployees()
    .then(([rows, fields]) => {
      const employees = rows;
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select an employee to update their role:',
          choices: employeeChoices,
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the ID of the new role for the employee:',
        },
      ])
        .then((answers) => {
          const { employeeId, newRoleId } = answers;
          // Update the employee's role in the database
          updateEmployeeRole(employeeId, newRoleId)
            .then(() => {
              console.log(`Employee's role updated successfully.`);
              promptBackToMenuOrQuit();
            })
            .catch((error) => {
              console.error('Error updating employee role:', error);
              promptBackToMenuOrQuit();
            });
        });
    })
    .catch((error) => {
      console.error('Error retrieving employees:', error);
    });
}

// Function to prompt user and remove an employee
function promptAndRemoveEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeId',
      message: "Enter the ID of the employee you want to remove:",
    },
  ])
    .then((answers) => {
      const { employeeId } = answers;
      // Remove the employee from the database
      removeEmployee(pool, employeeId)
        .then(() => {
          console.log(`Employee with ID ${employeeId} removed successfully.`);
        })
        .catch((error) => {
          console.error('Error removing employee:', error);
        })
        .finally(promptBackToMenuOrQuit);
    });
}

// Function to prompt user to go back to the menu or quit
function promptBackToMenuOrQuit() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'backToMenuOrQuit',
      message: 'Back to the main menu or quit?',
      choices: ['Back to Menu', 'Quit'],
    },
  ])
    .then((answers) => {
      if (answers.backToMenuOrQuit === 'Back to Menu') {
        mainMenu();
      } else {
        console.log('Goodbye!');
        process.exit();
      }
    });
}

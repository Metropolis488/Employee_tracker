var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
const password = require("./test");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: password,
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected at id " +connection.threadId);
    springApp();
});

function springApp() {
    inquirer
    .prompt({
        name: "firstQ",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all departments",
            "View all roles",
            "Add employee",
            "Add department",
            "Add role",
            "Remove employee",
            "Remove department",
            "Remove role",
            "Exit"
        ]
    })
    .then(function(answer){
        switch (answer.firstQ) {
        case "View all employees": 
            viewAllEmployees(); 
            break;
        case "View all departments":
            departments();
            break;
        case "View all roles":
            roles();
            break;
        case "Add employee":
            addEmployee();
            break;
        case "Add department":
            addDept();
            break;
        case "Add role":
            addRole();
            break;
        case "Remove employee":
            removeEmployee();
            break;
        case "Remove department":
            removeDept();
            break;
        case "Remove role":
            removeRole();
            break;        
        case "Exit":
            connection.end();
            break;        
        }
    });
}

function viewAllEmployees() {
    var query = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM ((employee inner JOIN role ON employee.role_id = role.id) inner JOIN department ON role.department_id = department.id);";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n")
        console.log(cTable.getTable(res));
        springApp();
    })
}

function departments() {
    var query = "select id, name from department;";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n")
        console.log(cTable.getTable(res));
        springApp();
    })
}
function roles() {
    var query = "select department_id, title, salary from role;";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n")
        console.log(cTable.getTable(res));
        springApp();
    })
}
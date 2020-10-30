var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
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
            "Add employee.",
            "Add department",
            "Add role",
            "Remove employee.",
            "Remove department",
            "Remove role"
        ]
    })
    .then(function(answer){
        switch (answer.firstQ) {
        case "View all employees": 
            viewAllEmployees(); 
            break;
        }
    });
}

function viewAllEmployees() {
    var query = "SELECT employee.first_name, employee.last_name," + 
    "role.title, role.salary, department.name FROM ((employee inner JOIN role ON employee.role_id = role.id)" +
    "inner JOIN department ON role.department_id = department.id);";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(cTable.getTable(res));
    })
      connection.end();
}
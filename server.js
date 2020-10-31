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

function addEmployee() {
    var query = "SELECT title, id FROM role;";
    connection.query(query, function(err, res) {
        // var roleList = res.json({ id: res.department_id, title: res.title });
        var rawResp = res;
        var roleList = [];
        var roleId;
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title);
        }

    askEmployee();
    async function askEmployee() {
    // const {first, last, role} = 
    await inquirer.prompt([
       {
            message: "What is the new employees first name?",
            name: "first"
       },
       {
            message: "What is the new employees last name?",
            name: "last"
       },
       {
            type: "list",   
            message: "What is the employees role?",
            name: "role",
            choices: roleList
       }
    ])
    .then(function(answer) {
        roleId = rawResp[roleList.indexOf(answer.role)].id;
        connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", 
        [answer.first, answer.last, roleId], function (err, res) {
            if (err) throw err;
        })
        inquirer.prompt([
            {
                type: "list",
                message: "Would you like to perform another action?",
                name: "continue",
                choices: [
                    "Yes",
                    "No"
                ]
            }
        ])
        .then(function(answer) {
            switch (answer.continue) {
                case "Yes": springApp(); break;
                case "No": connection.end(); break;
            }
        })
    })
    }   
    })
}
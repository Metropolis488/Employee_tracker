var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
const password = require("./test");
const { restoreDefaultPrompts } = require("inquirer");

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
    // view queries
    const viewEmp = "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM ((employee inner JOIN role ON employee.role_id = role.id) inner JOIN department ON role.department_id = department.id);";
    const viewDept = "SELECT id, name FROM department;";
    const viewRole = "SELECT department_id, title, salary FROM role;";
    // remove queries
    const removeEmp = "SELECT id, first_name, last_name FROM employee";
    const deleteRole = "SELECT id, title, salary FROM role";
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
            viewTables(viewEmp); 
            break;
        case "View all departments":
            viewTables(viewDept);
            break;
        case "View all roles":
            viewTables(viewRole);
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
            removeEntry(removeEmp, "employee");
            break;
        case "Remove department":
            removeEntry(viewDept, "department");
            break;
        case "Remove role":
            removeEntry(deleteRole, "role");
            break;        
        case "Exit":
            connection.end();
            break;        
        }
    });
}

function viewTables(query) {
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
        var rawResp = res;
        var roleList = [];
        var roleId;
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleList.push(res[i].title);
        }
        console.log(res);

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
        closingPrompt();        
    })
    }   
    })
}

function addDept() {
    inquirer.prompt([
        {
            message: "Enter the name of the new department.",
            name: "newDept"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.newDept], function(err, res) {
            if (err) throw err;
            console.log(`Success! The ${answer.newDept} department has been added.`);
            closingPrompt();
        })
    })
}

function addRole() {
    connection.query("SELECT id, name FROM department", function(err, res) {
        var roleList2 = [];
        var deptID;
        if (err) throw err;
        console.log(cTable.getTable(res));
        for (var i = 0; i < res.length; i++) {
            roleList2.push({id: res[i].id, name: res[i].name});
        }
        rolePrompts();
    
    function rolePrompts() {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select a department for this role",
                name: "deptName",
                choices: roleList2
            },
            {
                message: "What is this role's title?",
                name: "roleName"
            },
            {
                message: "What is the salary for this role? (enter numbers only, no dollar sign or comma)",
                name: "rolePay"
            }
        ])
        .then(function(answer) {
            for (var i = 0; i < roleList2.length; i++) {
                if (answer.deptName == roleList2[i].name) {
                    deptID = roleList2[i].id;
                }
            }
            // console.log(test);
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.rolePay, deptID], function(err, res) {
                if (err) throw err;
                console.log(`You have created the ${answer.roleName} role`);
                closingPrompt();
            })
        })
    }
})
}

function removeEntry(query, tableName) {
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("\n")
        console.log(cTable.getTable(res));
        deleteingPrompt();
    })
    function deleteingPrompt() {
    inquirer.prompt([
        {
            message: "Please enter the ID of the entry you would like to delete.",
            name: "deleteID"
        }
    ])
    .then(function(answer) {
        connection.query("DELETE FROM ?? where id = ?", [tableName, answer.deleteID], function(err, res) {
            if (err) throw err;
        })
        closingPrompt();
    })
}
}

function closingPrompt() {
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
}
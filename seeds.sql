USE employee_db;

INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('Product');
INSERT INTO department (name) VALUES ('Sales');

INSERT INTO role (title, salary, department_id) VALUES ('Lead Dev', 85000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Developer', 65000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('QA', 75000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Sr. Marketing Analyst', 100000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Sr. Product Manager', 110000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Commercial Rep', 150000, 4);
INSERT INTO role (title, salary, department_id) VALUES ('The Boss', 0, 5);

INSERT INTO employee (first_name, last_name, role_id) VALUES ('Moe', 'Kline', 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Larry', 'Kline', 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Curley', 'Howard', 3);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Sally', 'Jones', 4);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Guy', 'Pierce', 5);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Dude', 'Man', 6);

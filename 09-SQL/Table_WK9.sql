-- Create Tables 
-- Import all data in order 
-- Make sure to keep table code in case need to drop table
-- Format code for better comprehension 


-- Departments 
CREATE TABLE Departments(
	dept_no VARCHAR(20) NOT null PRIMARY KEY, 
	dept_name VARCHAR(50) null
	
);


-- Titles
CREATE TABLE Titles(
	title_id VARCHAR(20) null PRIMARY KEY,
	title VARCHAR(50) null
	
);


-- Employees
CREATE TABLE Employees (
    emp_no INT   NOT NULL,
    emp_title_id VARCHAR(10)   NOT NULL,
    birth_date VARCHAR(10)   NOT NULL,
    first_name VARCHAR(30)   NOT NULL,
    last_name VARCHAR(30)   NOT NULL,
    sex VARCHAR(10)   NOT NULL,
    hire_date VARCHAR(30)   NOT NULL,
    CONSTRAINT "pk_employees" PRIMARY KEY (
        "emp_no"
     )
);



-- Department Employees
CREATE TABLE Dept_emp (
    emp_no INT   NOT NULL,
    dept_no VARCHAR(10)   NOT NULL
);



-- Department Manager 
CREATE TABLE Dept_manager (
    dept_no VARCHAR(10)   NOT NULL,
    emp_no INT   NOT NULL
);



-- Salaries 
CREATE TABLE Salaries (
    emp_no INT  NOT NULL,
    salary INT   NOT NULL
);


-- Query for questions 1-8
-- Number 1
SELECT
	e.emp_no,
	e.last_name,
	e.first_name,
	e.sex,
	s.salary
FROM
	employees e
JOIN
	salaries s ON e.emp_no = s.emp_no

-- Number 2 
-- Come back to this
SELECT 
first_name, 
last_name, 
hire_date
FROM Employees
-- Not too sure on this one 
	
-- Number 3 
SELECT
	dm.dept_no,
	d.dept_name,
	dm.emp_no,
	e.first_name,
	e.last_name
FROM
	dept_manager dm
JOIN
	departments d ON dm.dept_no = d.dept_no
	JOIN employees e ON dm.emp_no = e.emp_no
	
-- Number 4 
SELECT
	e.emp_no,
	e.first_name,
	e.last_name,
	d.dept_name
FROM
	employees e
JOIN
	dept_emp de ON e.emp_no = de.emp_no
	JOIN departments d ON de.dept_no = d.dept_no
	
-- Number 5 
SELECT
	first_name,
	last_name,
	sex
FROM
	employees
WHERE
	first_name = 'Hercules'
AND
	last_name LIKE 'B%'
	
-- Number 6 
SELECT 
	e.emp_no, 
	e.last_name, 
	e.first_name, 
	d.dept_name 
FROM
	Employees 
AS 
	e 
JOIN 
	Dept_Emp 
AS 
	de 
ON de.emp_no = e.emp_no
JOIN Departments AS d ON d.dept_no = de.dept_no
WHERE dept_name = 'Sales';

-- Number 7 
SELECT
	e.emp_no, 
	e.last_name, 
	e.first_name, 
	d.dept_name 
FROM Employees AS e 
JOIN Dept_Emp AS de ON de.emp_no = e.emp_no
JOIN Departments AS d ON d.dept_no = de.dept_no
WHERE dept_name = 'Sales' OR dept_name = 'Development';

-- Number 8 
SELECT
	COUNT(emp_no) AS frequency, 
	last_name
FROM Employees 
GROUP BY last_name
ORDER BY frequency DESC; 
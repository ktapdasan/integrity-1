<?php
require_once('../connect.php');
require_once('../../CLASSES/Employees.php');

$filters = array(
					'pk' => NULL,
					'employee_id' => NULL,
					'first_name' => NULL,
					'middle_name' => NULL,
					'last_name' => NULL,
					'email_address' => NULL,
					'business_email_address' => NULL,
					'date_created' => NULL,
					'details' => NULL,
					'archived' => NULL
				);

foreach($_POST as $k=>$v){
	$filters[$k] = $v;
}

$class = new Employees(
						$filters['pk'], 
						$filters['employee_id'], 
						$filters['first_name'], 
						$filters['middle_name'], 
						$filters['last_name'], 
						$filters['email_address'], 
						$filters['business_email_address'], 
						$filters['date_created'],
						$filters['details'],
						$filters['archived']
					);

$data = $class->fetch_all($_POST);
print_r($filters['details']);
header("HTTP/1.0 404 User .");
if($data['status']){
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>
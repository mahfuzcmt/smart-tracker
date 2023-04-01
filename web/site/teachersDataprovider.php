<?php
	require_once 'dbconnect.php';
  $query = mysql_query("select fullName, teacherCode, loginID, profileScore, university, subject, year, 
   IFNULL(imagePath, (CASE WHEN gender = 'Male' THEN 'img/teacher/male.png'
   WHEN gender = 'Lady' THEN 'img/teacher/lady.png'
 END)) as imagePath, gender, expectedSalary, expectedClass, expectedDaysPerWeek, 
   livingPlace, expectedCity, expectedLocation, maritalStatus from Teacher where 1=1 and 
   status = 'Active' and profileScore > '69' order by teacherScore DESC limit 10");
	$data = array();
	while ($row = mysql_fetch_array($query)) {
	  $data[] = $row;
	}
	
    echo   json_encode(array(
        "result" => $data
    ));;
?>
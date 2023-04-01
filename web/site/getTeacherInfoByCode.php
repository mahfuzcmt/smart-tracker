<?php

//$json=$_GET ['json'];
 $obj = json_decode(file_get_contents('php://input'), true);

	require_once 'dbconnect.php';
  $query = mysql_query("select fullName, university, subject, gender
   from Teacher where 1 = 1 and teacherCode  = '".$obj['teacherCode']."'");
	$data = array();
	while ($row = mysql_fetch_array($query)) {
	  $data[] = $row;
	};	
    echo   json_encode(array(
         $data
    ));;
?>



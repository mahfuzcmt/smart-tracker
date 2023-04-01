<?php

//$json=$_GET ['json'];
 $obj = json_decode(file_get_contents('php://input'), true);

	require_once 'dbconnect.php';
  $query = mysql_query("select preferedGender, mediumOID, areaOID, preferedUniversity
   from Tuition where 1=1 and tuitionCode  = '".$obj['tuitionCode']."'");
	$data = array();
	while ($row = mysql_fetch_array($query)) {
	  $data[] = $row;
	};	
    echo   json_encode(array(
         $data
    ));;
?>



<?php
	require_once 'dbconnect.php';
  $query = mysql_query("select classOID as class, preferedGender, preferedUniversity, minimumSalary, 
   (CASE WHEN preferedGender = 'Male' THEN 'male.png'
      WHEN preferedGender = 'Lady' THEN 'lady.png'
      WHEN preferedGender = 'Male/Lady' THEN 'any.png'
    END) AS image, contactNo, mediumOID, tuitionCode, mediaFee, areaOID, groupOfStudy,
   preferedSubjects, presentAddress, preferedDuration, preferedTime,
	 dayPerWeek from Tuition where 1=1 and status = 'Active' order by createdOn DESC");
	$data = array();
	while ($row = mysql_fetch_array($query)) {
	  $data[] = $row;
	}
	
    echo   json_encode(array(
        "result" => $data
    ));;
?>
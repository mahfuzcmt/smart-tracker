<?php  
//$json=$_GET ['json'];
$obj = json_decode(file_get_contents('php://input'), true);

require_once 'dbconnect.php';

$OID = uniqid("Req");


$sql = "INSERT INTO Request (oid, teacherCode, tuitionCode, fatherAndMotherNo, friendsNameAndNo, status)
 VALUES ('$OID', '".$obj['teacherCode']."', '".$obj['tuitionCode']."', '".$obj['fatherAndMotherNo']."', 
 '".$obj['friendsNameAndNo']."','Pending')";  


$result = mysql_query($sql);
if(!$result){
    echo (mysql_error());
} 


 $posts = array(1);
    header('Content-type: application/json');
    echo json_encode(array('posts'=>$posts)); 
  ?>

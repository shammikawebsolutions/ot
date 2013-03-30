<?php
	include_once '../include/db.php';
	$connection=db_connect();
	
	$ads=array();
	
	$sql="
		SELECT *
		FROM ads 
		WHERE active='yes'
	";
	$result=mysql_query($sql,$connection);
	while($row=mysql_fetch_array($result))
	{		
		$ads[]=array
		(
			'image'=>$row['image'],
			'url'=>$row['url'],
			'type'=>$row['type']
		);
	}
	header("Content-type:application/json");
	//echo json_encode($ads);
	
	echo "jsonp_callback('".json_encode($ads)."')";
     
	
	mysql_close($connection);
?>
<?php

	$action = @$_GET['action'];
	if(!isset($action)){	
		echo 'arguments error';
	}else{	
		switch($action){
			case 'generatepage'	: generatePage($id);
			case 'savepage'		: savepage();
			case 'other'		: echo 'other';
			default				: echo 'no such action';
		}
	}
	
	function generatePage($id){
		
	
	}
	
	function savepage(){
		if(isset($_POST['page'])){
			echo $page;
			
		}
	
	
	}
	

?>
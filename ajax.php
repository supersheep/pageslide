<?php


	$action = @$_GET['action'];
	if(!isset($action)){	
		die('arguments error');
	}else{	
		switch($action){
			case 'generatepage'	: generatePage();break;
			case 'savepage'		: save();break;
			case 'other'		: echo 'other';break;
			default				: echo 'no such action';break;
		}
	}
	
	function generatePage(){
		$name = @$_GET['name'];
		$data = @$_POST['data'];
		if(!isset($name))die('arguments error, $name required');
		if(!isset($data))die('arguments error, $data required');
		echo $data;
	}
	
	function save(){
		$name = @$_GET['name'];
		$data = @$_POST['data'];		
		if(<!></!>isset($name))die('arguments error, $name required');
		if(!isset($data))die('arguments error, $data required');
		if(isset($_POST['data'])){
			echo $data;			
		}	
	}


?>
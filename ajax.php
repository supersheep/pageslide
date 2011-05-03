<?php

	$action = @$_GET['action'];
	if(!isset($action)){	
		die('arguments error');
	}else{	
		switch($action){
			case 'generatepage'	: generatePage();break;
			case 'save'			: save();break;
			case 'savepage'		: savePage();break;
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
	
	function savePage(){
		$name = @$_GET['name'];
		$data = @$_POST['data'];
		if(!isset($name))die('arguments error, $name required');
		if(!isset($data))die('arguments error, $data required');
		
		$page = '<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8"><title>PageSlider</title><link id="base" rel="stylesheet" type="text/css" href="../css/base.css" media="all"><link id="status" rel="stylesheet" type="text/css" href="../css/final.css" media="all"><script src="js/addbtn.js"></script></head><body><div class="wrapper"><div class="board">'.$data.'</div></div></body></html>';
		
		file_put_contents('page/'.$name.'.html',$page);		
		echo 'generated!';
	}
	
	
	
	
	function save(){
		$name = @$_GET['name'];
		$data = @$_POST['data'];		
		if(!isset($name))die('arguments error, $name required');
		if(!isset($data))die('arguments error, $data required');
		if(isset($_POST['data'])){
			echo $data;			
		}	
	}


?>
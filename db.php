<?php

	$conn = mysql_connect('localhost','root','');
	mysql_select_db('pageslide');
	
	$result = mysql_query('select * from `templete`');
	
	function find($fields,$filter='',$table='templete'){
		$array = array();
		if(is_array($fields)){
			$fields = implode(',',$fields);
		}
		if($filter!=''){
			$wherestr = ' where '.$filter;
		}else{
			$wherestr = '';
		}
		$sql = 'select '.$fields.' from `'.$table.'`'.$wherestr ;
		//echo $sql;
		
		$re = mysql_query($sql);
		while($row = mysql_fetch_array($re)){
			array_push($array,$row);
		}
		
		return $array;
	}
	
	function has($key,$value,$table='templete'){
		$sql = 'select * from '.$table.' where '.$key.'="'.$value.'"';
		$re = mysql_query($sql);
		return mysql_num_rows($re)>0;
	}
	
	function insert($keyvalues,$table='templete'){		
		$keys = array_keys($keyvalues);
		$values = array();
		foreach($keyvalues as $v){
			array_push($values,sprintf('\'%s\'',$v));
		}		
		$sql = 'insert into '.$table.' ('.implode(',',$keys).') values ('.implode(',',$values).')';
		mysql_query($sql);
	}
	
	function update($keyvalues,$filter,$table='templete'){
		$where = array();
		if(!is_array($filter)){
			$where = array($filter);		
		}
		
		foreach($filter as $k => $v){
			$tempstr = $k.'='.'"'.$v.'"';
			array_push($where,$tempstr);
		}	
		
		$where = implode(' and ',$where); 
	
		$keys = array_keys($keyvalues);
		$arr = array();
		foreach($keyvalues as $k => $v){
			$tp = '`'.$k.'` = '.'\''.$v.'\'';
			array_push($arr,$tp);
		}
		$toset = implode(',',$arr);	
	
	
		$sql = 'update '.$table.' set '.$toset.' where '.$where;
		mysql_query($sql);
	} 
	
	function delete($array){
		$filter = array();
		if(!is_array($array)){
			$filter = array($array);		
		}
		
		foreach($array as $k => $v){
			$tempstr = $k.'='.'"'.$v.'"';
			array_push($filter,$tempstr);
		}	
		
		$filter = implode(' and ',$filter);  
		$sql = 'delete from `templete` where '.$filter;
		mysql_query($sql);
	}
	
	
	//usage:
	/*		
		update(array('name'=>'mnamerh',	'data' => 'mydhahahahaata'),array('id'=>'8'));
		find('data','name="name"');
		has('id','2');
		insert(array('name'=>'mnddddddame','data'=>'mydata'));
	*/ 

?>
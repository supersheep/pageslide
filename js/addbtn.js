(function(){
	var modules = $$('.module');
	var btn = new Element('div',{'class':'btn'});
	window.ready = 0;
	btn.set('html','add');
	for( var i=0,l=modules.length ; i < l ; i++ ){
		var newbtn = btn.clone();		
		var currentmodule = modules[i].set('id','module_'+ i.toString(36));
		
		newbtn.addEvent('click',function(){
			var id = this.getParent().get('id');
			var ready = ( window.ready == l-1 );
			window.open(
			'process.html?id=' + id + '&reportname=' + pagename + '&ready=' + ready,
			'process',
			'height=200,width=400'
			);
		});
		newbtn.inject(currentmodule);
		
	}
})();
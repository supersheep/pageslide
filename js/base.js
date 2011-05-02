Element.prototype.toHtml = function(){
	var wrap,html;
	wrap = new Element('div');
	this.inject(wrap);
	html = wrap.get('html');
	wrap.dispose();
	return html;			
};
		
String.prototype.toElem = function(){
	var wrap,elem;
	wrap = (new Element('div')).set('html',this);
	elem = wrap.getFirst();
	return elem;
};


function Do(path){	
	var script = (new Element('script')).set('src',path);
	script.inject($$('head')[0]);
}


var console = console || {};


console.show = function (msg){
	$('console').set('html',msg);
}
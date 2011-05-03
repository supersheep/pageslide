Element.prototype.toHtml = function(){
	var wrap,html;
	wrap = new Element('div');
	this.clone(1,1).inject(wrap);
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

function Delegate(holder,select,type,fn){
	holder = $(holder);
	holder.addEvent(type,function(e){
		var c = holder.getElements(select);
		if( c.contains(e.target)){
			fn.call(e.target,e);
		};
		//c.contains(e);
	});
}


function Do(path){	
	var script = (new Element('script')).set('src',path);
	script.inject($$('head')[0]);
}


var console = console || {};


console.show = function (msg){
	$('console').set('html',msg);
}
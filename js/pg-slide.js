var PageSlide = {};

(function(P){

var msg = {
	cantremove : '再删就没啦',
	cantslice : '宽度或高度不足，无法再切割了',
	setname : '给你的模板起个名字吧：'
};


var Container = new Class({

	fit : function(type,n){		
		var old = this.elem['get' + type.capitalize()](),			
			margin = {
				width : 'gridmargin',
				height : 'rowmargin'
			},		
			min = {
				width : 'hmin',
				height : 'vmin'
			};			
		var newsize, re;
		
		if(old){
			newsize = ( old - this.opt[margin[type]] ) / 2;
		}else{
			newsize = '100%';
		}		
		
		n = n || newsize;			
		if ( n != '100%' && n < this.opt[min[type]] ){
			alert(msg.cantslice);
			re = false;
		}else{
			re = n;
		}
		
		return re;
	},


	size : function(type,v){			
		this.elem.setStyle(type, v=='100%' ? v : v + 'px');
	},	


})

var Grid = new Class({
		opt:{			
			gridcls : 'grid', 
			rowmargin : 15,
			hhcls : 'hhandler'
		},
		
		Extends : Container,
		
		initialize : function (opt,row) {
			this.opt = opt = $merge(this.opt,opt);
			this.parentrow = row;		
			var cls = opt.gridcls;
			this.elem = new Element('div', {
					'class' : cls
				});	
			this.unselectable();
			this.showhideBtn();
			this.prepareFunc();
		},
		unselectable:function(){
			var el = this.elem;
			el.set('unselectable','on');//for ie
			el.set('onselectstart','return false');//for webkit
			el.setStyle('-moz-user-select','none')//for ff
		},
		showhideBtn:function(){
			this.elem.addEvent('mouseover',function(){
				this.getElements('.btn').removeClass('hide');
			});
			this.elem.addEvent('mouseout',function(){
				this.getElements('.btn').addClass('hide');
			});
		},
		prepareFunc : function () {
			var _this = this;
			var func = new Element('div', {
					'class' : 'gridfunc'
				});
			var btnbasecls = ' btn hide';
			var btns = {
				slicegrid : {
					cls : 'btnslicegrid',
					txt : '吅',
					handler : function(){
						_this.sliceGrid();
					}
				}, 
				slicerow : {
					cls : 'btnslicerow',
					txt : '吕',
					handler : function(){
						_this.sliceRow();
					}
				}
			};
			for (var key in btns) {
				var btn = btns[key];
				var elem = new Element('a', {
						'class' : btn.cls + btnbasecls, 
						'html' : btn.txt
					});
				elem.addEvent('click', (function () {
							var hd = btn.handler;
							return function () {
								hd();
							}
						})());				
				elem.inject(func);
			}
			func.inject(this.elem, 'top');
		},		
		
		
		sliceRow : function(){
			var el = this.elem;
			var parentrow = this.parentrow;
			var hasSibling = this.elem.getSiblings('.grid').length ;
			var opt = this.opt;
			if( ! hasSibling){				
				var h = parentrow.fit('height');
				if(h){
					parentrow.size('height',h);
					var row = new Row(opt);
					row.addGrid();
					row.elem.inject(parentrow.elem,'after');
					row.size('height',h);
					var vhandler = new Vhandler(opt);
					vhandler.elem.inject(parentrow.elem,'after');	
				}
			}else{
				var h = this.fit('height');
				if(h){
					rowa = new Row(opt);	
					rowa.addGrid();
					rowa.size('height',h);
					rowa.elem.inject(el);					
					var vhandler = new Vhandler(opt);
					vhandler.elem.inject(el);	
					rowb = new Row(opt);
					rowb.addGrid();
					rowb.size('height',h);
					rowb.elem.inject(el);
				}
			}
			if(this.elem){
				
			}
		},
		
		sliceGrid : function(){
			var el = this.elem;	
			var opt = this.opt;
			var w;	
			w = this.fit('width');
			if(w){
				this.size('width',w);
				var grid = new Grid(opt);
				grid.elem.inject(el,'after');
				grid.size('width',w);
				var hhandler = new Hhandler(opt);
				hhandler.elem.inject(el,'after');
			}
		}
		
	});

var Row = new Class({
		
		opt:{
			rowcls:'row',
			rowmargin:10
		},
		
		
		Extends : Container,
		
		initialize : function (opt) {
			this.opt = opt = $merge(this.opt,opt);
			var cls = opt.rowcls;
			this.elem = new Element('div', {
					'class' : cls
				});	
			this.showhideBtn();
			//this.addGrid();
			this.prepareFunc();
		}, 
		
		showhideBtn:function(){
			this.elem.addEvent('mouseover',function(){
				this.getElements('.btn').removeClass('hide');
			});
			this.elem.addEvent('mouseout',function(){
				this.getElements('.btn').addClass('hide');
			});
		},
		
		prepareFunc : function () {
			var _this = this;
			var func = new Element('div', {
					'class' : 'rowfunc'
				});
			var btnbasecls = ' btn hide';
			var btns = {
				addgrid : {
					cls : 'btnaddrow',
					txt : '+',
					handler : function(obj){
						_this.addRow();
					}
				}, 
				removerow : {
					cls : 'btnremoverow',
					txt : '-',
					handler : function(obj){
						_this.removeRow();
					}
				}
			};
			for (var key in btns) {
				var btn = btns[key];
				var elem = new Element('a', {
						'class' : btn.cls + btnbasecls, 
						'html' : btn.txt
					});
				elem.addEvent('click', (function () {
					var hd = btn.handler;
					return function () {
						hd();
					}
				})());
				elem.inject(func);
			}
			func.inject(this.elem, 'top');
		},
		
		
		addGrid : function () {
			var grid = new Grid(this.opt,this);
			grid.elem.inject(this.elem);
			grid.size('width',grid.fit('width'));
		},
		
		addRow : function (obj) {
			var el = this.elem;
			var nextvhandler = el.getNext('.vhandler');
			var row = new Row(this.opt);
			row.addGrid();
			row.size('height',100);
			row.elem.inject(nextvhandler,'after');
			var vhandler = new Vhandler(this.opt);
			vhandler.elem.inject(row.elem,'after');
		},
		
		removeRow : function(){
			var el = this.elem;
			var rownum = document.getElements('.' + this.opt.rowcls).length;
			if( rownum > 1 ){
				el.getNext().destroy();
				el.destroy();	
			}else{
				alert(msg.cantremove);
			}
		}
	});

var Handler = new Class({
		opt:{
			hmin : 50,
			vmin : 50
		},
		initialize : function (elem, mode,opt) {
			this.opt = opt = $merge(this.opt,opt);
			this.elem = elem;
			this.mode = mode;
			this.document = elem.getDocument();
			this.unselectable();
			elem.addEvent('mousedown', this.start.bind(this));
			elem.addEvent('mouseup',this.end.bind(this));
		}, 
		unselectable:function(){
			var el = this.elem;
			el.set('unselectable','on');//for ie
			el.set('onselectstart','return false');//for webkit
			el.setStyle('-moz-user-select','none')//for ff
		},
		start : function (event) {
			this.startpos = event.page;
			
			this.prev = this.elem.getPrevious();
			this.prev.size = this.prev.getSize();
			this.next = this.elem.getNext();
			if (this.next) {
				this.next.size = this.next.getSize();
			}
			this.document.addEvent('mousemove', this.move.bind(this));
			this.document.addEvent('mouseup', this.end.bind(this));
		}, 
		move : function (event) {
		
			var mode = this.mode;
			var next = this.next;
			var prev = this.prev
			var changed = {
				'h' : event.page.x - this.startpos.x ,
				'v' : event.page.y - this.startpos.y
			};
			
			var nprev = {
				'h' : prev && prev.size.x + changed.h ,
				'v' : prev && prev.size.y + changed.v
			};
			
			var nnext = {
				'h' : next && next.size.x - changed.h ,
				'v' : next && next.size.y - changed.v
			};
			
			var min = {
				'h' : this.opt.hmin ,				
				'v' : this.opt.vmin
			};
			
			var wh = {
				'h' : 'width' ,
				'v' : 'height'
			};
			
			var size = {
				'h' : 'x',
				'v' : 'y'
			};
			
			if(prev){
				if( next ){
				if( nprev[mode] > min[mode] && nnext[mode] > min[mode] ){					
					prev.setStyle(wh[mode],prev.size[size[mode]] + changed[mode] );
					next.setStyle(wh[mode],next.size[size[mode]] - changed[mode] );
					//console.show(  (prev.size[size[mode]] + changed[mode]) + ' , ' + (prev.size[size[mode]] - changed[mode]));		
					//console.trace();					
				}			
				}else{
					if( nprev[mode] > min[mode] ){				
						prev.setStyle(wh[mode],prev.size[size[mode]] + changed[mode] );				
						//console.show(prev.size[size[mode]] + changed[mode] );
					}
				}				
			}
			
			
		}, 
		end : function (event) {
			this.document.removeEvents('mousemove');
			this.document.removeEvents('mouseup');
			this.prev = null;
			this.next = null;
			this.startpos = null;
		}
		
	});

var Hhandler = new Class({
		opt:{		
			hhcls : 'hhandler', 
			gridmargin : 10,
		},
		initialize : function (opt) {		
			this.opt = opt = $merge(this.opt,opt);
			var cls = opt.hhcls;
			var width = opt.gridmargin;
			this.elem = new Element('div', {
					'class' : cls
				});
			this.elem.setStyle('width',width+'px');
			new Handler(this.elem,'h');
		}
	});

var Vhandler = new Class({
		opt : {		
			vhcls : 'vhandler', 
			rowmargin : 10,
		},
		initialize : function (opt) {
			this.opt = opt = $merge(this.opt,opt);
			var cls = opt.vhcls;
			var height = opt.rowmargin;
			this.elem = new Element('div', {
					'class' : cls
				});
			this.elem.setStyle('height',height+'px');
			new Handler(this.elem, 'v');
		}
	});
	
P.Doc = new Class({
		opt : {			
			doccls : 'doc', 
			rowcls: 'row',
			gridcls: 'grid',
			rowmargin: 10,
			gridmargin: 20, 
		},
		
		initialize : function (opt) {
			this.opt = opt = $merge(this.opt,opt);
			this.ajaxurl = 'ajax.php?action={action}&name={name}';
			var cls = opt.doccls;
			this.rowmargin = opt.rowmargin;
			this.elem = document.getElement('.' + cls);
			this.addRow();
		}, 
			
		addRow : function () {
			var row = new Row(this.opt);
			row.addGrid();
			row.elem.inject(this.elem);
			row.size('height','100');
			var vhandler = new Vhandler(this.opt);
			vhandler.elem.inject(this.elem);
		}, 
		
							
		// @return json 返回文档结构 
		getStruct : function (){
			//返回容器内Row结构	
			function getRowStruct(elem){
				var rows = [];
				var rowelems = elem.getChildren('.row');
				for(var i = 0, l = rowelems.length ; i < l ; i++ ){
					var rowelem = rowelems[i]
					var row = {};
					row.height = rowelem.getHeight();
					row.grids = getGridStruct(rowelem);	
					rows.push(row);
				}
				return rows;
			};
		
			//返回容器内Grid结构
			function getGridStruct(elem){
				var grids = [];
				var gridelems = elem.getElements('>.grid');
				for(var i = 0, l = gridelems.length ; i < l ; i++ ){
					var gridelem = gridelems[i];
					var grid = {};
					grid.width = gridelem.getWidth();
					if(gridelem.getElement('.row')){
						grid.rows = getRowStruct(gridelem);
					}	
					grids.push(grid);
				}
				return grids;
			};	
				
			var elem = this.elem;			
			var doc = {}; 
			doc = $merge(doc,this.opt);
			doc.rows = getRowStruct(elem);
			this.struct = doc;
			return this.struct;
		},
		
		//返回容器内 Row HTML 结构 
		
		
		//生成文档html结构，doc内的结构
		getPageHtml : function (){
			var _this = this;
			function getRowHtml( obj , wrap ){
				if(obj.rows){
					var rows = obj.rows;
					var rowcls = _this.opt.rowcls;
					for(var i = 0 , l = rows.length ; i < l ; i++ ){
						var row = rows[i];
						var rowelem = new Element('div',{'class':rowcls});
						rowelem.setStyle('height',row.height);					
						rowelem = getGridHtml(row,rowelem);		
						if( i == l-1){
							rowelem.addClass('last');
						}	
						rowelem.inject( wrap );
					}				
				}
				return wrap;
			};	
 		
			//返回容器内 Grid 结构		
			function getGridHtml(obj,wrap){
				if(obj.grids){
					var grids = obj.grids;
					var gridcls = _this.opt.gridcls;
					for( var i = 0 , l = grids.length ; i < l ; i++ ){
					var grid = grids[i];
						var gridelem = new Element('div',{'class':gridcls});
						gridelem.setStyle('width',grid.width);
						girdelem = getRowHtml(grid,gridelem);
						if( i == l-1){
							gridelem.addClass('last');
						}	
						if( !gridelem.getElements('.row').length ){
							(new Element('div',{'class':'module'})).inject(gridelem);
						}
						gridelem.inject(wrap);
					}	
				}
				return wrap;
			};
			
		
		
			var doc = this.struct || this.getStruct();
			var rowcls = doc.rowcls,
				rows = doc.rows,
				doccls = doc.doccls,
				gridcls = doc.gridcls,
				docelem = new Element('div',{'class':doccls});
				
				//wrap = new Element('div');				
				docelem.set('id',doccls);
				docelem = getRowHtml(doc,docelem);
			return docelem;
		},	
		
		getEditingHtml : function () {
			var _this = this;
			function getRowHtml( obj , wrap ){
				if(obj.rows){
					var rows = obj.rows;
					var rowcls = _this.opt.rowcls;
					for(var i = 0 , l = rows.length ; i < l ; i++ ){
						var row = rows[i];
						var rowelem = new Row();
						rowelem.addGrid();
						var elem = rowelem.elem;
						elem.setStyle('height',row.height);					
						elem = getGridHtml(row,rowelem);	
						elem.inject( wrap );							
						if( i != l-1){								
							var hhandler = new Hhandler();
							hhandler.elem.inject(wrap);
						}	
					}				
				}
				return wrap;
			};	
 		
			//返回容器内 Grid 结构		
			function getGridHtml(obj,wrap){
				if(obj.grids){
					var grids = obj.grids;
					var gridcls = _this.opt.gridcls;
					for( var i = 0 , l = grids.length ; i < l ; i++ ){
					var grid = grids[i];
						var gridelem = new Element('div',{'class':gridcls});
						gridelem.setStyle('width',grid.width);
						girdelem = getRowHtml(grid,gridelem);
						if( i == l-1){
							gridelem.addClass('last');
						}	
						if( !gridelem.getElements('.row').length ){
							(new Element('div',{'class':'module'})).inject(gridelem);
						}
						gridelem.inject(wrap);
					}	
				}
				return wrap;
			};
			
		
		
			var doc = this.struct || this.getStruct();
			var rowcls = doc.rowcls,
				rows = doc.rows,
				doccls = doc.doccls,
				gridcls = doc.gridcls,
				docelem = new Element('div',{'class':doccls});
				
				//wrap = new Element('div');	
				docelem.set('id',doccls);
				docelem = getRowHtml(doc,docelem);
			return docelem;
		},
		
		generatePage:function(){
			var finaled,name,args;			
			name = pagename = pagename || prompt(msg.setname);
			if(!name)return;
			args = {action:'generatepage',name:name}
			this.save();
			finaled = this.getPageHtml();
			new Request({
				url:this.ajaxurl.substitute(args), 
				method: 'post',
				onComplete: function(e){
					console.log(e);		
				}
			}).send('data=' + finaled.toHtml());
			finaled.replaces(this.elem);
			$('status').set('href','css/final.css');
			Do('js/addbtn.js');
		},		
		
		//生成
		generateEditingPage : function (){
				
		},	
		
		showTempletes : function(){				
			args = {action:'list'};
			new Request({
				url: this.ajaxurl.substitute(args), 
				onComplete: function(msg){
					var array = JSON.decode(msg);
					var listbox = $('listbox');
					var top = window.getScroll().y + 50;
					var left = ( window.getWidth() - 500 )/2;
					var ul = listbox.getElement('ul').empty();
					listbox.setStyles({'top':top + 'px' , 'left':left + 'px'});
					listbox.addClass('show');
					for( var i=0,l=array.length ; i < l ; i++ ){
						var li = new Element('li').inject(ul);
						var a = new Element('a').set({'html':array[i],'href':'javascript:;'}).inject(li);						
					}
					Delegate(listbox,'a','click',function(e){
						var name = e.target.get('html');
						doc.load(name);
						pagename = name;
						$('listbox').removeClass('show');					
					});
				}
			}).send();
		},
		
		load : function (name){
			var args = {action:'load','name':name};
			new Request({
				url: this.ajaxurl.substitute(args),
				onComplete: function(json){
					json = JSON.decode(json);
					doc.makeUI(json);
					doc.struct = json;
				}
			}).send();
		},
		
		makeUI :function(json){			
			function makeRowUI(wrapper,rows,opt){
				for(var i = 0, l = rows.length; i < l ; i++ ){
					var row = new Row(opt);
					row.size('height',rows[i]['height']);
					if(rows[i]['grids']){				
						row.elem = makeGridUI(row.elem,rows[i]['grids'],opt);
					}
					row.elem.inject(wrapper);
					if( row.elem.getParent() == $('doc') ||  //最外层的元素
						(row.elem.getParent()!=$('doc')&& i < l-1) ){	//或者不是最后一个内层元素					
						var vhandler = new Vhandler(opt);
						vhandler.elem.inject(row.elem,'after');
					}
				}
				return wrapper;
			}
			
			function makeGridUI(wrapper,grids,opt){
				for(var i = 0 , l = grids.length ; i < l ; i++ ){
					var grid = new Grid(opt);
					grid.size('width',grids[i]['width']);
					if(grids[i]['rows']){
						grid.elem = makeRowUI(grid.elem,grids[i]['rows'],opt);
					}
					grid.elem.inject(wrapper);
					if(i<l-1){
						var hhandler = new Hhandler(opt);
						hhandler.elem.inject(grid.elem,'after');
					}					
				}
				return wrapper;
			}
			
			this.opt = json;
			var rowmargin = json.rowmargin;
			var gridmargin = json.gridmargin;
			var rows = json.rows;
			var ele = makeRowUI(this.elem.empty(),rows,this.opt);
			ele.replaces(this.elem);
		},
		
		save : function () {
			var struct,name,args;

			struct = this.getStruct();			
			name = pagename = pagename || prompt(msg.setname);
			args = {action:'save',name:name}
			new Request({
				url: this.ajaxurl.substitute(args), 
				method: 'post',
				onComplete: function(e){
					console.log(e);		
				}
			}).send('data=' + JSON.encode(this.getStruct()));
			
			//console.log(struct);
			//console.log(JSON.encode(struct));			
		}
	});
})(PageSlide);
 
 	
 
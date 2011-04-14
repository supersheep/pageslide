var errors = {
	cantremove : '再删就没啦',
	cantslice : '再分就看不到啦' 
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
			alert(errors.cantslice);
			re = false;
		}else{
			re = n;
		}
		
		return re;
	},


	set : function(type,v){			
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
				},
				moverow : {
					cls : 'btnmoverow',
					txt : 'm',
					handler : function (obj) {
						console.log(obj)
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
					parentrow.set('height',h);
					var row = new Row(opt);
					row.elem.inject(parentrow.elem,'after');
					row.set('height',h);
					var vhandler = new Vhandler(opt);
					vhandler.elem.inject(parentrow.elem,'after');	
				}
			}else{
				var h = this.fit('height');
				if(h){
					rowa = new Row(opt);	
					rowa.set('height',h);
					rowa.elem.inject(el,'bottom');					
					var vhandler = new Vhandler(opt);
					vhandler.elem.inject(el,'bottom');	
					rowb = new Row(opt);
					rowb.set('height',h);
					rowb.elem.inject(el,'bottom');
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
				this.set('width',w);
				var grid = new Grid(opt);
				grid.elem.inject(el,'after');
				grid.set('width',w);
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
			this.addGrid();
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
				moverow : {
					cls : 'btnmoverow',
					txt : 'm',
					handler : function (obj) {
					
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
			grid.set('width',grid.fit('width'));
		},
		
		addRow : function (obj) {
			var el = this.elem;
			var nextvhandler = el.getNext('.vhandler');
			var row = new Row(this.opt);
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
				alert(errors.cantremove);
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
			var xchanged = event.page.x - this.startpos.x;
			var ychanged = event.page.y - this.startpos.y;
			if (this.mode == 'v') {
				this.prev.setStyle('height', this.prev.size.y + ychanged);
				if (this.next) {
					this.next.setStyle('height', this.next.size.y - ychanged);
				}
			} else if (this.mode == 'h') {
				var prevwidth = this.prev.size.x + xchanged;
				var nextwidth = this.next.size.x - xchanged;
				var hmin = this.opt.hmin;
				if( prevwidth > hmin && nextwidth > hmin ){
					this.prev.setStyle('width', this.prev.size.x + xchanged);
					this.next.setStyle('width', this.next.size.x - xchanged);
				}
			}
		}, 
		end : function (event) {
			this.document.removeEvents('mousemove');
			this.document.removeEvents('mouseup');
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
	
	/*
	
	doc:{
		rowmargin:
		gridmargin:
		rows:[
			{
				height:f,
				grids:[]
			}
		]
	}
	*/

var Doc = new Class({
		opt : {			
			doccls : 'doc', 
			rowcls: 'row',
			gridcls: 'grid',
			rowmargin: 10,
			gridmargin: 20, 
		},
		
		initialize : function (opt) {
			this.opt = opt = $merge(this.opt,opt);
			var cls = opt.doccls;
			this.rowmargin = opt.rowmargin;
			this.elem = document.getElement('.' + cls);
			this.addRow();
		}, 
		addRow : function () {
			var row = new Row(this.opt);
			row.elem.inject(this.elem);
			var vhandler = new Vhandler(this.opt);
			vhandler.elem.inject(this.elem);
		}, 
		getGridStruct : function(elem){
			var grids = [];
			var gridelems = elem.getElements('>.grid');
			for(var i = 0, l = gridelems.length ; i < l ; i++ ){
				var gridelem = gridelems[i];
				var grid = {};
				grid.width = gridelem.getWidth();
				if(gridelem.getElement('.row')){
					grid.rows = this.getRowStruct(gridelem);
				}	
				grids.push(grid);
			}
			return grids;
		},
		getRowStruct : function(elem){
			var rows = [];
			var rowelems = elem.getElements('>.row');
			for(var i = 0, l = rowelems.length ; i < l ; i++ ){
				var rowelem = rowelems[i]
				var row = {};
				row.height = rowelem.getHeight();
				row.grids = this.getGridStruct(rowelem);	
				rows.push(row);
			}
			return rows;
		},
		
		getStruct : function (){
			var elem = this.elem;			
			var doc = {}; 
			doc = $merge(doc,this.opt);
			doc.rows = this.getRowStruct(elem);
			this.struct = doc;
			return this.struct;
		},
		
		getRowHtml : function(obj,wrap){
			if(obj.rows){
				var rows = obj.rows;
				var rowcls = this.opt.rowcls;
				for(var i = 0 , l = rows.length ; i < l ; i++ ){
					var row = rows[i];
					var rowelem = new Element('div',{'class':rowcls});
					rowelem.setStyle('height',row.height);					
					rowelem = this.getGridHtml(row,rowelem);		
					if( i == l-1){
						rowelem.addClass('last');
					}	
					rowelem.inject(wrap);
				}				
			}
			return wrap;
		},
		
		getGridHtml : function(obj,wrap){
			if(obj.grids){
				var grids = obj.grids;
				var gridcls = this.opt.gridcls;
				for( var i = 0 , l = grids.length ; i < l ; i++ ){
					var grid = grids[i];
					var gridelem = new Element('div',{'class':gridcls});
					gridelem.setStyle('width',grid.width);
					girdelem = this.getRowHtml(grid,gridelem);
					if( i == l-1){
						gridelem.addClass('last');
					}	
					gridelem.inject(wrap);
				}	
			}
			return wrap;
		},
		
		generatePage : function (){
			var doc = this.getStruct();
			var rowcls = doc.rowcls,
				rows = doc.rows,
				doccls = doc.doccls,
				gridcls = doc.gridcls,
				docelem = new Element('div',{'class':doccls}),
				body = new Element('body');
				html = new Element('html');
				
				
				
			docelem = this.getRowHtml(doc,docelem)
			docelem.inject(wrap);
			
			
							
			console.log(wrap.get('html'));
		},
					
		save : function () {
			var struct = this.getStruct()
			console.log(struct);
			console.log(JSON.encode(struct));			
		}
	});
 
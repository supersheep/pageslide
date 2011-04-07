var errors = {
	cantremove : '再删就没啦'
};

var Grid = new Class({
		opt:{			
			gridcls : 'grid', 
			rowmargin : 15,
			hhcls : 'hhandler'
		},
		
		initialize : function (opt) {	
			this.opt = opt = $merge(this.opt,opt);
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
					txt : '|',
					handler : function(){
						_this.sliceGrid();
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
		fitWidth : function(w){
			var oldwidth = this.elem.getWidth();
			var width;
			if(oldwidth){
				width = ( oldwidth - this.opt.gridmargin ) / 2;
				width += 'px';
			}else{
				width = '100%';
			}
			w = w || width;
			this.elem.setStyle('width',w);
			return width;
		},
		sliceGrid : function(){
			var el = this.elem;	
			var grid = new Grid(this.opt);
			var w;
			grid.elem.inject(el,'after');			
			w = this.fitWidth();
			grid.fitWidth(w);
			var hhandler = new Hhandler(this.opt);
			hhandler.elem.inject(el,'after');
		}
		
	});

var Row = new Class({
		
		opt:{
			rowcls:'row',
			rowmargin:10
		},
		
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
			var grid = new Grid(this.opt);
			grid.elem.inject(this.elem);
			grid.fitWidth();
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
			var rownum = document.getElements('.' + this.cls).length;
			if( rownum > 1 ){
				el.getNext().destroy();
				el.destroy();	
			}else{
				alert(errors.cantremove);
			}
		}
	});

var Handler = new Class({
		hmin : 50,
		initialize : function (elem, mode) {
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
				var hmin = this.hmin;
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
		save : function () {
			var json;
			var rowarr=[],gridarr,rowattr=[];
			var el = this.elem;
			var rows = el.getElements('.row');
			for(var i = 0 , l = rows.length ; i < l ; i++){				
				var rowheight = rows[i].getHeight();
				var grids = rows[i].getElements('.grid');
				gridarr = [];
				rowattr = [];
				for(var j = 0 , k = grids.length ; j < k ; j++ ){
					var gridwidth = grids[j].getWidth()
					gridarr.push(gridwidth);
				}
				gridstr = 'grids:[' + gridarr.join(',') + ']';
				
				rowattr.push('height:' + rowheight);
				rowattr.push(gridstr);
				rowarr.push( '{' + rowattr.join(',') + '}');
			}
			rowstr = '[' + rowarr.join(',') + ']';			
			json = "doc:" + rowstr;
			console.log(json);
		}
	});
 
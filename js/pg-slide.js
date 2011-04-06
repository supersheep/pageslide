var Grid = new Class({
		cls : 'grid', 
		margin : 15,
		
		initialize : function (cls) {
			cls = cls || this.cls;
			this.elem = new Element('div', {
					'class' : cls
				});			
			this.showhideBtn();
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
					'class' : 'gridfunc'
				});
			var btnbasecls = ' btn hide';
			var btns = {
				slicegrid : {
					cls : 'btnslicegrid',
					txt : '|',
					handler : function(obj){
						obj.sliceGrid();
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
							var o = _this
							return function () {
								hd(o);
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
				width = ( oldwidth - this.margin ) / 2;
			}else{
				
			}
			this.width = this.elem.getWidth() || '100%';
			w = w || this.width;
			this.elem.setStyle('width',w);
		},
		sliceGrid : function(){
			var el = this.elem;	
			var grid = new Grid();
			var w;
			w = 
			grid.elem.inject(el,'after');			
			this.fitWidth();
			grid.fitWidth();
			var hhandler = new Hhandler(this.margin);
			hhandler.elem.inject(el,'after');
		}
		
	});

var Row = new Class({
		cls : 'row', 
		margin : 15,
		
		initialize : function (cls) {
			cls = cls || this.cls;
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
					handler : function(el){
						console.log(el);
					}
				}, 
				moverow : {
					cls : 'btnmoverow',
					txt : 'm',
					handler : function (obj) {
						console.log(obj);
					}
				},
				removerow : {
					cls : 'btnremoverow',
					txt : '-',
					handler : function(obj){
						_this.removeRow(obj);
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
							var o = _this;
							return function () {
								hd(o);
							}
						})());
				elem.inject(func);
			}
			func.inject(this.elem, 'top');
		}, 
		addGrid : function () {
			var grid = new Grid();
			grid.elem.inject(this.elem);
			grid.fitWidth();
		},
		removeRow : function(obj){
			var el = obj.elem;
			el.getNext().destroy();
			el.destroy();	
		}
	});

var Handler = new Class({
		initialize : function (elem, mode) {
			this.elem = elem;
			this.mode = mode;
			this.document = elem.getDocument();
			elem.addEvent('mousedown', this.start.bind(this));
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
				this.prev.setStyle('width', this.prev.size.x + xchanged);
				this.next.setStyle('width', this.next.size.x - xchanged);
			}
		}, 
		end : function (event) {
			this.document.removeEvents('mousemove');
			this.document.removeEvents('mouseup');
		}
		
	});

var Hhandler = new Class({
		cls : 'hhandler', 
		width : 10,
		initialize : function (width,cls) {
			cls = cls || this.cls;
			width = width || this.width;
			this.elem = new Element('div', {
					'class' : cls
				});
			this.elem.setStyle('width',width+'px');
			new Handler(this.elem,'h');
		}
	});

var Vhandler = new Class({
		cls : 'vhandler', 
		height : 10,
		initialize : function (height,cls) {
			cls = cls || this.cls;
			height = height || this.height;
			this.elem = new Element('div', {
					'class' : cls
				});
			this.elem.setStyle('height',height+'px');
			new Handler(this.elem, 'v');
		}
	});
	
	

var Doc = new Class({
		cls : 'doc', 
		
		initialize : function (rowmargin,gridmargin,cls) {
			cls = cls || this.cls;
			this.rowmargin = rowmargin;
			this.elem = document.getElement('.' + cls);
			this.addRow();
		}, 
		addRow : function () {
			var row = new Row();
			row.elem.inject(this.elem);
			var vhandler = new Vhandler(this.rowmargin);
			vhandler.elem.inject(this.elem);
		}, 
		save : function () {
		}
	});
 
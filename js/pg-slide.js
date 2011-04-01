var Grid = new Class({
		elem : null, 
		cls : 'grid', 
		initialize : function (cls) {
			cls = cls || this.cls;
			this.elem = new Element('div', {
					'class' : cls
				});
			this.prepareFunc();
		},
		prepareFunc : function () {
			var func = new Element('div', {
					'class' : 'gridfunc'
				});
			var btnbasecls = 'btn hide';
			var btns = {
				slicegrid : {
					cls : 'btnslicegrid',
					txt : '-',
					handler : this.sliceGrid.bind(this)
				}, 
				moverow : {
					cls : 'btnmoverow',
					txt : 'm',
					handler : function (elem) {
						console.log(elem)
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
		sliceGrid : function(){
		
		}
		
	});

var Row = new Class({
		elem : null, 
		cls : 'row', 
		initialize : function (cls) {
			cls = cls || this.cls;
			this.elem = new Element('div', {
					'class' : cls
				});
			this.addGrid();
			this.prepareFunc();
		}, 
		prepareFunc : function () {
			var func = new Element('div', {
					'class' : 'rowfunc'
				});
			var btnbasecls = 'btn hide';
			var btns = {
				addgrid : {
					cls : 'btnaddgrid',
					txt : '+',
					handler : this.addGrid.bind(this)
				}, 
				moverow : {
					cls : 'btnmoverow',
					txt : 'm',
					handler : function (elem) {
						console.log(elem)
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
			console.log(this.elem);
			var grid = new Grid();
			grid.elem.inject(this.elem);
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
		elem : null, 
		cls : 'hhandler', 
		initialize : function (cls) {
			cls = cls || this.cls;
			this.elem = new Element('div', {
					'class' : cls
				});
		}
	});

var Vhandler = new Class({
		elem : null, 
		cls : 'vhandler', 
		initialize : function (cls) {
			cls = cls || this.cls;
			this.elem = new Element('div', {
					'class' : cls
				});
			new Handler(this.elem, 'v');
		}
	});

var Doc = new Class({
		elem : null, 
		cls : 'doc', 
		initialize : function (cls) {
			cls = cls || this.cls;
			this.elem = document.getElement('.' + cls);
		}, 
		addRow : function () {
			var row = new Row();
			row.elem.inject(this.elem);
			var vhandler = new Vhandler();
			vhandler.elem.inject(this.elem);
		}, 
		save : function () {
		}
	});
 
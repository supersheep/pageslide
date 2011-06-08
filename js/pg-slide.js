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
	
	/**
	 *	调整行或网格的高度或宽度
	 *	参数
	 *
	**/


	size : function(type,v){			
		this.elem.setStyle(type, v=='100%' ? v : v + 'px');
	},	


})

var Grid = new Class({
	//默认配置，当初始化函数未传入opt时使用此配置替代。
	opt:{			
		gridcls : 'grid', 
		rowmargin : 15,
		hhcls : 'hhandler'
	},
		
	//扩展 Container 类以使用其中的函数
	Extends : Container,
	
	
	//初始化函数
	initialize : function (opt,row) {
		this.opt = opt = $merge(this.opt,opt);//将参数opt合并到当前对象的opt属性上去
		this.parentrow = row;		//设置grid的父元素
		var cls = opt.gridcls;		//将opt中的gridcls存为当前作用域的副本，以节约作用域链查找的时间
		this.elem = new Element('div', {
				'class' : cls //创建元素
			});	
		this.unselectable();//设置元素不可选中
		this.showhideBtn(); //显示隐藏工具条
		this.prepareFunc(); //绑定相关函数
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
		//保存当前作用域下的this值
		var _this = this;
		//创建工具条容器
		var func = new Element('div', {
				'class' : 'gridfunc'
			});
		var btnbasecls = ' btn hide';
		//使用一个json数据结构来定义所有的工具按钮
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
		//遍历btns，生成按钮并绑定相应事件
		for (var key in btns) {
			var btn = btns[key];
			var elem = new Element('a', {
					'class' : btn.cls + btnbasecls, 
					'html' : btn.txt
			});
			elem.addEvent('click', (function () {
				var hd = btn.handler;
				//创建闭包，保持住hd的值，从而在触发事件时仍然可以访问之
				return function () {
					hd();
				}
			})());				
			//将按钮插入工具条中
			elem.inject(func);
		}
		//将工具条插入grid中
		func.inject(this.elem, 'top');
	},		
		
	//切割行的方法
	sliceRow : function(){
		var el = this.elem;
		var parentrow = this.parentrow;
		var hasSibling = this.elem.getSiblings('.grid').length ;
		var opt = this.opt;
		//若当前网格是当前行中唯一的网格，则切割父亲行容器
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
		//否则则在其中添加高度相同的两个子行容器
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
	
	
	//切割网格容器的方法
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
				/*
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
				*/		
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
				if(next){
					if( nprev[mode] > min[mode] && nnext[mode] > min[mode] ){
						if(this.fit(prev,'prev') && this.fit(next,'next') ){
							prev.setStyle(wh[mode],prev.size[size[mode]] + changed[mode] );								
							next.setStyle(wh[mode],next.size[size[mode]] - changed[mode] );
						}
					}
				}else if( nprev[mode] > min[mode] ){	
					if(this.fit(prev,'prev')){
						prev.setStyle(wh[mode],prev.size[size[mode]] + changed[mode] );		
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
		},
		
		fit : function (elem,type){
			var _this = this;
			var hmin = this.opt.hmin;
			var vmin = this.opt.vmin;
			var hmargin = 15;
			var vmargin = 15;
			var mode = this.mode;
			var childs;
			var ret = true ;
			var returns = [];
			
			
			if(mode == 'h'){		
				//左右grid			
					
				
				childs = elem.getElements('>.row').getElements('>.grid');					
				// 如果没有后继了
				if(!childs.length){
					//
					//判断					
					return elem.getStyle('width').slice(0,-2)>=hmin;
				}else{
					childs.each(function(e,i){
						if(e.length){
							
							var prev = type=='prev'?true:false;
							j = prev?0:1,
							l = prev?e.length-1:e.length,
							n = prev?e.length-1:0,
							h = e[0].getParent('.grid').getStyle('width').toInt()-1;
							
							for(; j < l;j++){
								h -= e[j].getStyle('width').slice(0,-2);
								h -= vmargin;
							}											
							
							e = e[n];
							//h = h<hmin?'50':h;
							e.setStyle('width',h);	
						}		
						
						if(_this.fit(e,type)){
							returns[i]=true;
						}else{
							returns[i]=false;
							//e.setStyle('height',hmin);
						}					
					})
					return !returns.contains(false);
				}		
				
			}else if( mode == 'v'){		
				
				childs = elem.getElements('>.grid').getElements('>.row');					
				// 如果没有后继了
				if(childs.length==1&&!childs[0].length){
					//
					//判断					
					return elem.getStyle('height').slice(0,-2)>=hmin;
				}else{
					childs.each(function(e,i){
						if(e.length){
							
							var prev = type=='prev'?true:false;
							j = prev?0:1,
							l = prev?e.length-1:e.length,
							n = prev?e.length-1:0,
							h = e[0].getParent('.row').getStyle('height').slice(0,-2);
							
							for(; j < l;j++){
								h -= e[j].getStyle('height').slice(0,-2);
								h -= hmargin;
							}											
							
							e = e[n];
							//h = h<hmin?'50':h;
							e.setStyle('height',h);	
						}						
						if(_this.fit(e,type)){
							returns[i]=true;
						}else{
							returns[i]=false;
							//e.setStyle('height',hmin);
						}					
					})
					return !returns.contains(false);
				}		
		
			}
				
			//while(elem.getElements('.grid'));
			
			//return true;
		
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
			this._addRow();
			//this.makeUI(opt);
		}, 
		
		create : function(json){
			if(!pagename&&confirm('当前模板尚未保存，现在保存吗？')){				
				this.save();
			}
			
			this.makeUI(json);			
		},
			
		_addRow : function () {
			var row = new Row(this.opt);
			row.addGrid();
			row.elem.inject(this.elem);
			row.size('height','100');
			var vhandler = new Vhandler(this.opt);
			vhandler.elem.inject(this.elem);
		}, 
		
							
		// @return json 返回文档结构 
		_getStruct : function (){
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
		_getPageHtml : function (){
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
			
		
		
			var doc = this.struct || this._getStruct();
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
		
		_getEditingHtml : function () {
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
			
		
		
			var doc = this.struct || this._getStruct();
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
			finaled = this._getPageHtml();
			new Request({
				url:this.ajaxurl.substitute(args), 
				method: 'post',
				onComplete: function(e){
					console.log(e);		
				}
			}).send('data=' + finaled.toHtml());
			console.log(this.elem);
			//finaled.replaces(this.elem);
			//$('status').set('href','css/final.css');
			//Do('js/addbtn.js');
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
					Delegate(listbox.getElement('ul'),'a','click',function(e){
						var name = e.target.get('html');
						doc.load(name);
						pagename = name;
						listbox.removeClass('show');					
					});
					listbox.getElement('div a').addEvent('click',function(){
						listbox.removeClass('show');
						return false;
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
			this.struct = json;
			ele.replaces(this.elem);
		},
		
		save : function () {
			var struct,name,args;

			struct = this._getStruct();			
			name = pagename = pagename || prompt(msg.setname);
			args = {action:'save',name:name}
			if(name){
				new Request({
					url: this.ajaxurl.substitute(args), 
					method: 'post',
					onComplete: function(e){
						//console.log(e);		
					}
				}).send('data=' + JSON.encode(this._getStruct()));
			}
			//console.log(struct);
			//console.log(JSON.encode(struct));			
		}
	});
})(PageSlide);
 
 	
 
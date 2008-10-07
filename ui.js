Ext.namespace('Ext.ux.plugins');

Ext.ux.Token = Ext.extend(Ext.Component, {
	initComponent : function(){
		Ext.ux.Token.superclass.initComponent.call(this);
	},

	onRender: function(ct, position){
		Ext.ux.Token.superclass.onRender.call(this, ct, this.maininput);
		
		this.addEvents('remove');
		
		this.addClass('x-form-token');
		
		this.el = ct.createChild({ tag: "li" }, this.maininput);
		this.el.addClassOnOver('x-form-token-hover');
		
		Ext.apply(this.el, {
			
			'focus': function(){
				this.down('a').focus();
			},
			
			'dispose': function(){
				this.dispose()
			}.createDelegate(this)
			
		});

		this.el.on('click', function(e){
			this.focus()
		}, this, {stopEvent:true});

		this.el.update(this.caption);

		this.close = this.el.createChild({
			'tag': 'a',
			'class': 'closebutton',
			'href':'#'
		});
		
		this.input = new Ext.form.ComboBox({
			renderTo: this.el,
			typeAhead: true,
			resizable: true,
			hideTrigger: true,
			cls: 'x-form-token-input'
		})
				
		this.lnk.on({
			'click': function(e){
				e.stopEvent();
				this.fireEvent('remove', this);
				this.dispose();
			},
			'focus': function(){
				this.el.addClass("x-form-token-focus");
			},
			'blur': function(){
				this.el.removeClass("x-form-token-focus");
			},
			scope: this
		});
		
		new Ext.KeyMap(this.el, [
			{
				key: [Ext.EventObject.BACKSPACE, Ext.EventObject.DELETE],
				fn: function(){
          			this.backspace();
				}.createDelegate(this)
			},
			{
				key: Ext.EventObject.RIGHT,
				fn: function(){
					this.move('right');
				}.createDelegate(this)
			},
			{
				key: Ext.EventObject.LEFT,
				fn: function(){
					this.move('left');
				}.createDelegate(this)
			},
			{
				key: Ext.EventObject.TAB,
				fn: function(){
					
				}.createDelegate(this)
			}
		]).stopEvent = true;

	},
	
	backspace: function() {
		
	},
	
	move: function(direction) {
		if(direction == 'left')
			el = this.el.prev();
		else
			el = this.el.next();
		if(el)
			el.focus();
	},
		
	dispose: function() {
		//if(el.prev() && this.retrieveData(el.prev(), 'small') ) el.prev().remove();
		//if(this.current == el) this.focus(el.next());
		//if(el.data['type'] == 'box') el.onBoxDispose(this);
		this.el.hide({
			duration: .5,
			callback: function(){
				this.move('right');
				this.destroy()
			}.createDelegate(this)
		});
		return this;
	}
});

Ext.ux.TokenList = Ext.extend(Ext.form.Field, {
	initComponent:function() {
		Ext.apply(this, {
			selectedValues: {},
			boxElements: {},
			current: false,
			options: {
				className: 'bit',
				separator: ','
			},
			hideTrigger: true,
			grow: false
		});
			
		Ext.ux.TokenList.superclass.initComponent.call(this);
	},
	
	onRender:function(ct, position) {
		Ext.ux.TokenList.superclass.onRender.call(this, ct, position);

		this.el.removeClass('x-form-text');
		this.el.className = 'maininput';
		this.el.setWidth(20);

		this.holder = this.el.wrap({
			'tag': 'ul',
			'class':'holder x-form-text'
		});
				
		this.holder.on('click', function(e){
			e.stopEvent();
			if(this.maininput != this.current) this.focus(this.maininput);		 
		}, this);

		this.maininput = this.el.wrap({
			'tag': 'li', 'class':'bit-input'
		});
		
		Ext.apply(this.maininput, {
			'focus': function(){
				this.focus();
			}.createDelegate(this)
		});
		
	},
	
	onResize : function( w, h, rw, rh ){
		this._width = w;
		Ext.ux.TokenList.superclass.onResize.call(this, w, h, rw, rh);
		this.autoSize();
	},

	onKeyUp : function(e) {
	
		if(this.editable !== false && !e.isSpecialKey()){
			this.lastKey = e.getKey();
			if(e.getKey() == e.BACKSPACE && this.el.dom.value.length == 0){
				e.stopEvent();
				this.collapse();
				var el = this.maininput.prev();
				if(el) el.focus();
				return;
			}
			this.dqTask.delay(this.queryDelay);
		}

    this.autoSize();

		Ext.ux.TokenList.superclass.onKeyUp.call(this, e);
	},

	onSelect: function(record, index) {
		var val = record.data[this.valueField];
		
		this.selectedValues[val] = val;
		
		if(!this.boxElements[val]){
			var caption;
			if(this.displayFieldTpl)
				caption = this.displayFieldTpl.apply(record.data)
			else if(this.displayField)
			 	caption = record.data[this.displayField];
			 	
			var el = new Ext.ux.Box({
				maininput: this.maininput,
				renderTo: this.holder,
				className: this.options['className'],
				caption: caption,
				'value': record.data[this.valueField],
				listeners: {
					'remove': function(box){
						this.selectedValues[box.value] = null;
					},
					scope: this
				}
			});
			el.render();

			var hidden = this.el.insertSibling({
				'tag':'input', 
				'type':'hidden', 
				'value': val,
				'name': (this.hiddenName || this.name)
			},'before', true);
		}
		this.collapse();
		this.setRawValue('');
		this.lastSelectionText = '';
		this.applyEmptyText();

		this.autoSize();
	},

  autoSize : function(){
	  if(!this.rendered){
	      return;
	  }
	  if(!this.metrics){
	      this.metrics = Ext.util.TextMetrics.createInstance(this.el);
	  }
	  var el = this.el;
	  var v = el.dom.value;
	  var d = document.createElement('div');
	  d.appendChild(document.createTextNode(v));
	  v = d.innerHTML;
	  d = null;
	  v += "&#160;";
	  var w = Math.min(this._width, Math.max(this.metrics.getWidth(v) +  10, 10));
	  this.el.setWidth(w);
  },

	getValues: function(){
		var ret = [];
		for(var k in this.selectedValues){
			if(this.selectedValues[k])
				ret.push(this.selectedValues[k]);
		}
		return ret.join(this.options['separator']);
	}
});

Ext.reg('TokenList', Ext.ux.TokenList);
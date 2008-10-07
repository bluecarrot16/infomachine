//
// JavaScript Behaviors Library
// (c) 2007 Dan Yoder, All Rights Reserved
// Version: 0.5, License: MIT
// Web: http://code.google.com/p/cruiser/wiki/Behaviors
// Email: dan@zeraweb.com
// 


var Behaviors = {
	load: function() {
		$A(document.getElementsByTagName('link')).
			select( Behaviors.Stylesheet.test ).pluck('href').
			map( Behaviors.process );
	},
	process: function(href) { Behaviors.Stylesheet.load(href); }
}
Behaviors.Stylesheet = {
	test: function(link) { return link.rel == "behaviors"; },
	load: function(href) { new Ajax.Request(href, Behaviors.Stylesheet.request ); },
	process: function(t) { 
		var rules = Behaviors.Stylesheet.parse( t.responseText );
		rules.each( function(r) {
			var elements = $$(r.key);
			var attributes = $H(r.value);
			elements.each( function(e) {
				if (!e.binding) { e.binding = e; }
				attributes.each( function(a) {
					var fn = Behaviors.Attributes[a.key.camelize()];
					try{fn?fn(e,a.value):null}
					catch(all) {}
		}) }) });
	},
	Grammar: {},
	Translator: {
		style: function(attrs) {
			return attrs.inject($H({}),function(h,a) { h[ a[0] ] = a[1]; return h; })
		},
		rules: function(rx) {
			return rx.inject($H({}),function(h,r) { h[ r[0] ] = r[1]; return h; })			
		},
		parse: function(rx) {
			return rx.inject($H({}),function(h,r) { h.merge(r); return h; })						
		}
	},
	parse: function(s) { return  Behaviors.Stylesheet._parse(s).first(); }
}
with ( Parser.Operators ) {
	var g = Behaviors.Stylesheet.Grammar; var t = Behaviors.Stylesheet.Translator;
	// basic tokens
	g.lbrace = token('{'); g.rbrace = token('}');
	g.lparen = token(/\(/); g.rparen = token(/\)/);
	g.colon = token(':'); g.semicolon = token(';');
	// attributes
	g.attrName = token(/[\w\-\d]+/); g.attrValue = token(/[^;\}]+/); 
	g.attr = pair(g.attrName,g.attrValue,g.colon);
	g.attrList = list(g.attr,g.semicolon,true);
	g.style = process(between(g.lbrace,g.attrList,g.rbrace),t.style);
	// style rules
	g.selector = token(/[^\{]+/); 
	g.rule = each(g.selector,g.style); g.rules = process(many(g.rule),t.rules);
	// comments
	g.inlineComment = token(/\x2F\x2F[^\n]\n/);
	g.multilineComment = token(/\x2F\x2A.*?\x2A\x2F/);
	g.comments = ignore(any(g.inlineComment,g.multilineComment));
	// parser
	Behaviors.Stylesheet._parse = process(many(any(g.comments,g.rules)),t.parse);
}
Behaviors.Stylesheet.request = { method: 'get', onSuccess: Behaviors.Stylesheet.process };
Behaviors.Utils = {
	parseFunction: function(s) {
		return s.match(/(\w+)\s*\(\s*([^\)]+)\s*\)/);
	},
	bind: function( object, target ) {
		if ( (target instanceof Element) && target.binding ) { 
			Behaviors.Utils.bind( object, target.binding ) 
		} else object.binding = target;
	}
}
Behaviors.Bindings = {
	'new' : function(e,x) { Behaviors.Utils.bind( e,  eval('new '+x+'(e)') );  },
	'object' : function(e,x) {  Behaviors.Utils.bind(e, eval(x) );  },
	'select' : function(e,x) {  Behaviors.Utils.bind(e, $$0(x) );  },	
	'up' : function(e,x) { Behaviors.Utils.bind(e, e.up(x) ); },
	'down' : function(e,x) { Behaviors.Utils.bind(e, e.down(x) ); },
	'previous' : function(e,x) { Behaviors.Utils.bind(e, e.previous(x) ); },
	'next' : function(e,x) { Behaviors.Utils.bind(e, e.next(x) ); }
}
Behaviors.Relative = {
	// adds relative attribute functions: minimum, maximum, equal
	apply: function(e1,a,s,c) {
		var e2 = $$0(s); if (!e2) return;
		if ( c( parseInt(e1.getStyle(a)), parseInt(e2.getStyle(a))) ) { 
			e1.style[a] = e2.getStyle(a) 
		}
	}
}
Behaviors.Attributes = {
	binding: function(e,v) {
		var f = Behaviors.Utils.parseFunction(v);
		if (!f) return; var fname = f[1]; var x = f[2];
		var fn = Behaviors.Bindings[fname];
		if (fn) fn(e,x);
	}, 
	load: function(e,v) { if (e.binding[v]) e.binding[v](e); },
	hasFocus: function(e,v) { v = v.toLowerCase(); if (v=='true'||v=='yes') e.focus(); }
}
Behaviors.Attributes.Generic = {
	// adds an event handler to the element: blur, change, click, etc.
	event: function(e,v,h) { e.binding[v].toHandler(e,h).bind(e.binding); },
	// adds relative attributes: height, width ...
	relative: function(e,v,a) {
		var f = Behaviors.Utils.parseFunction(v);
		if (!f) return; var fname = f[1]; var s = f[2];
		var fn = Behaviors.Relative[fname];
		if (fn) fn(e,a,s);
	}
}
with (Behaviors) {
	$A(['blur','change','click','dblclick','focus','keydown','keypress','keyup',
		'mousedown','mousemove','mouseout','mouseover','mouseup','resize'])
		.each( function(h) { Attributes[h] = Attributes.Generic.event.rcurry(h); });
	$H({ minimum: Comparators.LessThan, maximum: Comparators.GreaterThan, equal: Comparators.Equal })
		.each( function(h) { Relative[ h[0] ] = Relative.apply.rcurry( h[1] ) });
	$A([ 'height', 'width' ])
		.each( function(a) {  Attributes[a] = Attributes.Generic.relative.rcurry(a) })	
}
Event.observe(window,'DOMContentLoaded', Behaviors.load);
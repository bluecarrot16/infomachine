//
// JavaScript Really Simple Date (RSD) Parser
// (c) 2007 Dan Yoder, All Rights Reserved
// Version: 0.5, License: MIT
// Web: http://code.google.com/p/cruiser/wiki/RSD
// Email: dan@zeraweb.com
// 

RSD.Grammar = {}; 
RSD.Translator = {
	nodes: function(d) { return $D(d) },
	cast: function(d) {
		var type = d[0], value = d[1];
		switch(type) {
			case 'date': return new Date(value);
			default: return d;
		}
	},
	string: function(s) {
		var m = s.match(/^\s*\d+\.\d+\s*$/);
		if (m) { return parseFloat(m[0]) }
		m = s.match(/^\s*\d+\s*$/);
		if (m) { return parseInt(m[0]); }
		return s; 
	}
};
( function(op,gr,tr) {
	
	// delimeters
	gr.lbracket = op.token(/\x5B/); gr.rbracket = op.token(/\x5D/); 
	gr.lbrace = op.token(/\x7B/); gr.rbrace = op.token(/\x7D/); 
		gr.not_rbrace = op.token(/[^\x7D]*/); 
	gr.lparen = op.token(/\x28/); gr.rparen = op.token(/\x29/);
		gr.not_rparen = op.token(/[^\x29]*/); 
	gr.squote = op.token(/\x27/); gr.not_squote = op.token(/[^\n\x27]*/);
	gr.squoted = op.between( gr.squote, gr.not_squote, gr.squote );
	gr.dquote = op.token(/\x22/); gr.not_dquote = op.token(/[^\n\x22]*/);
	gr.dquoted = op.between( gr.dquote, gr.not_dquote, gr.dquote );

	// keys - no newlines, braces, or semi-colon
	gr.key = op.any( gr.squoted, gr.dquoted, op.token(/[^\n\x7B\x7D\x3A]*/) );
	
	// scalars
	
	// numbers
	gr.integer = op.token(/\d+/); gr.decimal = op.token(/\d+\.\d+/);
	
	// strings
	gr.multiline = op.between( op.token('---'), op.token(/([^-]|-(?!--))*/) );
	// no newlines, braces, or comma
	gr.unquoted = op.process( op.token(/[^\n\x7B\x7D\x5B\x5D\x2C]*/), tr.string );
	gr.string = op.any( gr.squoted, gr.dquoted, gr.multiline, gr.unquoted );
	
	// fn( value )
	gr.fn = op.process( op.each( op.token(/[\w]+/),
		op.between( gr.lparen, gr.not_rparen, gr.rparen ) ), tr.cast );

	// sequence: [ 1, date(4/29/87), dog, "I'm" ]
	gr.sequence = op.between( gr.lbracket, op.forward( gr, 'scalars' ), gr.rbracket );
	
	gr.scalar = op.any( gr.fn, gr.sequence, gr.string );
	gr.scalars = op.list( gr.scalar );

	// objects
	gr.object = op.between( gr.lbrace, op.forward( gr, 'nodes' ), gr.rbrace );

	// nodes
	gr.scalar_node = op.pair( gr.key, gr.scalar, op.token(':') );
	gr.object_node = op.each( gr.key, gr.object );
	gr.node = op.any( gr.scalar_node, gr.object_node );
	gr.separator = op.any( op.re(/^\s+/), op.token('\x2C') );
	gr.nodes = op.process( op.list( gr.node, gr.separator, true ), tr.nodes );	
		
})( Parser.Operators, RSD.Grammar, RSD.Translator );

RSD.parse = function(s) {
	try { return ( RSD.Grammar.nodes(s)[0] ) }
	catch(e) { console.log(e) }
}
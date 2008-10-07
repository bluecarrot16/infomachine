//
// JavaScript Enumerable Library
// (c) 2007 Dan Yoder, All Rights Reserved
// Version: 0.2, License: MIT
// Web: http://code.google.com/p/cruiser/wiki/Enumerable
// Email: dan@zeraweb.com
// 


var Hash = function(object) {
  if (object) {
    for(var k in object) { if (!(typeof this[k]=='function')) { this[k] = object[k] } }
  }
};
Hash.convert = function(object) {
  for( var k in Hash.prototype ) { object[k] = Hash.prototype[k] }; return object; 
};
Hash.prototype = {
  each: function( fn ) { 
    for( var k in this ) {
      if (! ( typeof this[k] == 'function' )) { fn({0:k, 1: this[k], key: k, value: this[k]}) }
    }
    return this; 
  },
  merge: function( hash ) {
    var self = this;
    new Hash(hash).each( function(item) { self[item.key] = item.value }); return this;
  }
};
Array.prototype.each = function( fn ) {
  for(var i = 0; i<this.length; i++) { fn(this[i]) }; return this;
};

Array.prototype.flatten = function() {
  var rx = new Array(); for(var i = 0;i<this.length;i++) {
    if ( this[i] instanceof Array ) { rx = rx.concat( this[i].flatten() ); } 
    else { rx.push( this[i] ); }
  }
  return rx;
};
Array.prototype.compact = function() {
  var rx = new Array(); for(var i = 0;i<this.length;i++) {
    if ( this[i] instanceof Array ) { rx = rx.concat( this[i].compact() ); } 
    else if ( this[i] !== null || this[i] !== undefined ){ rx.push( this[i] ); }
  }
  return rx;
};
var Enumerable = {
  accumulate: function( rval, fn ) { 
    this.each( function( x ) { rval = fn(rval,x) } ); return rval; 
  },
  filter: function( fn ) {
    var r = []; this.each( function(x) { if (fn(x)) { r.push(x) } }); return r;
  },
  find: function( fn ) {
    var rval = null;
    this.each( function(x) { if (!rval && fn(x) ) { rval = x } } ); return rval;
  },
  map: function( fn ) {
    var results = []; this.each( function( x ) { results.push( fn(x) ) });
    return results;
  }
};
Enumerable.inject = Enumerable.accumulate;
Object.extend( Array, Enumerable );
Object.extend( Hash, Enumerable );
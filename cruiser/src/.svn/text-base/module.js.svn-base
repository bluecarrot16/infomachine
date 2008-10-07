//
// JavaScript Module Library
// (c) 2007 Dan Yoder, All Rights Reserved
// Version: 0.1, License: MIT
// Web: http://code.google.com/p/cruiser/wiki/Module
// Email: dan@zeraweb.com
// 

var Module = function(m) {
  if ( m !== undefined && m !== null && m.prototype ) { this.object = m; }
  else throw new ArgumentError('Object is undefined or not a module.');
};
Module.prototype = {
  extend: function(m) { 
    if ( m !== undefined && m !== null ) {
      for( var k in m ) { 
        this.object.prototype[k] = m[k] 
      }
      return this;
    } else {
      throw new ArgumentError('Cannot extend module with null or undefined value.')
    }
  }
};
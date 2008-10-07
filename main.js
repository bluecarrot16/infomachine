
// reference local blank image
Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/s.gif';

function $w(string) {
  if (!(Ext.type(string)=='string')) return [];
  string = string.strip();
  return string ? string.split(/\s+/) : [];
}

// Converts a hex string to an array of numbers
function toNumbers( str ){
  var ret = [];
   str.replace(/(..)/g, function(str){
    ret.push( parseInt( str, 16 ) );
  });
  return ret;
}

// Accepts any object. If the object is already an array, returns it. If it's not, returns an array containing the object.
function wrapArray( object ){
    if(Ext.type(object)=='array') {
        return object;
    } else {
        return [object];
    }
}

// Accepts any object. If the object is already a function, returns it. If it's not, returns a function returning the object.
function wrapFunction ( object ){
    if(Ext.type(object)=='function') {
        return object;
    } else {
        return (function(object) {
            return function() {
                return object;
            }
        })(object);
    }
}

// Sets the given array of [properties] to null in [object]
function deleteProperties ( properties, object ) {
    properties = wrapArray(properties);
    Ext.each(properties,function(prop) {
        if(object[prop]) {
            object[prop] = null;
        }
    });
    return object;
}

// takes an object and "flips" its properties and values (each value becomes a property and each property becomes a value)
Object.invert = function( object ){
    var newObject = {}, value = false;
    for(var prop in object) {
        value = object[prop];
        // if the value is an array of
        if(Ext.type(value)=='array') {
            for(var p in value) {
                object[p] = prop
            }
        }
        newObject[value] = prop;
    }
    return newObject;
}


Array.prototype.includes = function(value) {
    if(this.indexOf(value)>-1) { 
        return true;
    }
};
Array.prototype.contains = Array.prototype.includes;

// create application
App = (function() { 
    // private variables
    var items = {};
    var verbs = {};
    var functions = {};
    var types = {};
    var variables = {};
    var views = {};
    var workflows = {};
    var interfaces = {};
 
    // private functions
 
    // public space
    return {
        
        items: function() {
            return {
                // Get an item by ID
                get: function(ID) {
                    if(items[ID]) {
                        return items[ID];
                    } else {
                        App.error("Couldn\'t find an item with the ID "+ID+" !",true, ID);
                        return false;
                    }
                },
                // Create a new item
                create: function(config) {
                    var item = {
                        name:'',
                        ID:0,
                        type:'',
                        properties: {
                        
                        }
                    };
                }
            }
        }(),
        
        
        verbs: function() {
            return {
                // Get a verb by name
                get: function(name) {
                    if(verbs[name]) {
                        return verbs[name];
                    } else {
                        App.error("Couldn\'t find a verb named "+name+" !",true, name);
                        return false;
                    }
                },
                // Create a new verb
                create: function(config) {
                    var verb = {
                        name: '',                           
                        takes: null,                        
                        modifiers: null,                
                        expects: function(given) {      /* Returns hash containing two hashes: 'takes' and 'modifiers', each containing a list of arguments and type definitions.
                                                         * This function is called by the parser to determine what tokens to look for next, [given] the arguments already found.
                                                         * Example: 'create event "practice" on tuesday at 6:30p' given: {type:'event'}
                                                         *  expects: { takes: { name: 'text' }, modifiers: { on: 'date', at: 'date' } }
                                                         */
                            return { takes: {}, modifiers: {} }
                        }
                    };
                    
                    verb = Object.extend(verb,config);
                    verb.takes = wrapFunction(verb.takes);
                    verb.modifiers = wrapFunction(verb.modifiers);
                    verb.expects = wrapFunction(verb.expects);
                    if(verb.name!='') {
                        App.verbs.register(verb.name,verb);
                        return verb;
                    } else {
                        App.error('Must specify a name to create a verb!',
                                    true, {verb:verb});
                        return false;
                    }
                },

                // Register a verb by name
                register: function(name, definition) {
                    verbs[name] = definition;
                }

            }
        }(),
        
        types: function() {
            return {
                // Get a type by name
                get: function(name) {
                    if(types[name]) {
                        return types[name];
                    } else {
                        App.error("Couldn\'t find a type named "+name+" !",true, name);
                        return false;
                    }
                },                
                // Create a new type
                create: function(config) {
                    var type = {
                        name: '',                           // Name of the type 
                        inherits: 'item',                   // What type does this inherit from
                        isPrimitive:false,                  // Whether the type is a primitive (true, like text, date, number) or complex (false, like event, note, message)
                        isHidden:false,                     // Whether the type should be suggested in the command line (true, like event, note, message) or not (false, like url, date)
                        properties:null,                    // A hash of properties and their types
                        delimiters:[' ','*'],               // Left and right delimiters for the type (such as "s for text)
                        icon:null,                          // URL to a 16 x 16 icon
                        color:'#fbfbfb',                    // Color of a type's tag
                        interface: { },                     // xtype or Ext component config to be used as a user interface for editing this type
                        serialize: function() { },          // A function returing a string representation of this object
                        suggest: function(input) { },       // Given [input], should return an array of autocomplete suggestions 
                        match: function(value) { },         // Given [value], determines if [value] is of this type
                        creation: function() {              /* Returns a hash containing two fields: takes and modifiers, each as parameters to be accepted with the verb 'create'
                                                             * Example: 'create event "practice" on tuesday at 6:30pm' -> {takes: {name: 'text'}, modifiers: {on: 'date', at: 'date'}}
                                                             */
                            return {                        
                                takes: {},
                                modifiers: {}
                            }
                        }
                    };
                    type = Ext.applyIf(config, type);
                    type.creation = wrapFunction(type.creation);
                    
                    if(type.name!='') {
                        App.types.register(type.name,type);
                        return type;
                    } else {
                        App.error('Must specify a name to create a type!',
                                    true, type);
                        return false;
                    }
                },

                // Create a temporary (intermin) type. This is used for stuff like ad-hoc enumerated types, like "modifier" types that are never registered, etc. 
                createInterim: function(config) {
                    var type = {
                        name: '',                           // Name of the type 
                        isPrimitive:false,                  // Whether the type is a primitive (true, like text, date, number) or complex (false, like event, note, message)
                        isHidden:false,                     // Whether the type should be suggested in the command line (true, like event, note, message) or not (false, like url, date)
                        properties:null,                    // A hash of properties and their types
                        delimiters:[' ',' '],               // Left and right delimiters for the type (such as "s for text)
                        icon:null,                          // URL to a 16 x 16 icon
                        color:'#fbfbfb',                    // Color of a type's tag
                        interface: { },                     // xtype or Ext component config to be used as a user interface for editing this type
                        serialize: function() { },          // A function returing a string representation of this object
                        suggest: function(input) { },       // Given [input], should return an array of autocomplete suggestions 
                        match: function(value) { },         // Given [value], determines if [value] is of this type
                        creation: function() {              /* Returns a hash containing two fields: takes and modifiers, each as parameters to be accepted with the verb 'create'
                                                             * Example: 'create event "practice" on tuesday at 6:30pm' -> {takes: {name: 'text'}, modifiers: {on: 'date', at: 'date'}}
                                                             */
                            return {                        
                                takes: {},
                                modifiers: {}
                            }
                        }
                    };
                    type = Ext.applyIf(config, type);
                    type.creation = wrapFunction(type.creation);
                    return type;
                },
                
                // Register a type by name
                register: function(name, definition) {
                    types[name] = definition;
                }
            }
        }(),
        
        parser: function() {
            
            return {
                /* Gets the text up to the given delimiter and returns it plus the working string
                 * - working (string)    : the working string
                 * - delimiter (Mixed)   : the delimiter, or array of delimiters
                 * returns: { 
                 *    working: working string
                 *    value: the token 
                 *  }
                 */
                parseToDelimiter: function(working, delimiter) {
                    switch(Ext.type(delimiter)) {
                        case 'array':
                            o = Parsing.Operators;
                            delimiters = [];
                            Ext.each(delimiter,function(x) {
                                delimiters.push(o.token(x));
                            });
                            var test = o.until(o.any(delimiters));
                            var out = test(working);
                            return {
                                working: out[1],
                                value: out[0]
                            };
                        case 'string':
                            var arr = working.split(delimiter);
                            var value = arr.splice(0,1)[0];
                            var working = arr.join(delimiter);
                            return {
                                working: working,
                                value: value
                            };
                    }
                },
                
                /* Guesses the intended type of a token
                 * - token (string)       : the input token to be considered
                 * - expects (Mixed)      : a type or an array of expected types (names or type objects) to choose from
                 * returns: type (string) : the name of a type  
                 */
                guessType: function(token, expects) {
                    var result = 'text';
                    expects = wrapArray(expects);
                    Ext.each(expects, function(type) {
                        // Detect whether the given type is a type object or a type name
                        if(Ext.type(type)=='string') {
                            type = App.types.get(type);
                        } 
                        
                        // If we've succeeded in pulling a type object with a valid match() function
                        if(type.match) {
                            // If the shoe fits, we have a new winner
                            if(type.match(token)) {
                                result = type.name;
                            }
                        }
                    });
                    
                    return result;
                },
                
                /* Gets the next token off of a working string
                 * - working (string)  : the working string
                 * - expects (Mixed)   : the type(s) of token coming next. Can be the name of a type, or an array of type names, a type object, or an array of type objects
                 * - exit (array)      : an array of exit conditions (exit strings)
                 * returns: { 
                 *    working (string) : working string
                 *    type (string)    : the name of the type of token
                 *    value (Mixed)    : the value of the token: either a complex noun or a primitive or something
                 *  }
                 */
                getToken: function(working,expects,exit) {
                    /* Overview:
                        This function takes a command fragment and tries to come up with 
                        a complete token of text that can either become a primitive or a
                        complex noun. The function takes a list of acceptable types for 
                        the next token to fit, then tries to guess which of the types the
                        resulting token fits.
                        
                        We start by fetching a list of type objects, then see if any of 
                        those types identify a "left delimiter" (such as a '(' or '"').
                        If so, and the working string contains this delimiter, then it's
                        easy to guess the type. If not, the parser breaks the token off 
                        at the next white space (' '), and then tries to guess the type
                        of the resulting chunk.
                    */
                    
                    // Eat extra whitespace
                    working = working.strip();
                    
                    // Get an array of type objects for the types that are expected to come next
                    var list = []; // an array of type objects that we expect
                    switch(Ext.type(expects)) {
                        // If multiple types are expected
                        case 'array':
                            // Add each expected type that exists to a list
                            Ext.each(expects,function(type) {
                                // Arrays of expected types can contain type names or type objects
                                switch(Ext.type(type)) {
                                    case 'string':
                                        var type = App.get("type",type);
                                        if(type) {
                                            list.push(type);
                                        }
                                        break;
                                    case 'object': 
                                        if(App.interfaces.match(type, 'type')) {
                                            list.push(type)
                                        }
                                        break;
                                }
                            });
                            break;
                        // If only one type is expected
                        case 'string':
                            var type = App.get("type",expects);
                            if(type) {
                                list.push(type);
                            }
                            break;
                        case 'object': 
                            if(App.interfaces.match(expects, 'type')) {
                                list.push(type);
                            }
                    }
                    
                    // See first if any of the types expect delimiters
                    var delimiters = {}
                    Ext.each(list,function(type) {
                        // See if the type expects any delimiters at all
                        if(type.delimiters) {
                            // See if the type expects a left delimiter
                            if((type.delimiters[0])&&(type.delimiters[0]!=' ')) {
                                delimiters[type.delimiters[0]] = type;
                            }
                        }
                    });
                    // If at least one type expects a delimiter
                    for(var delimiter in delimiters) {
                        // If the working string starts with the delimiter
                        if(working.startsWith(delimiter)) {
                            // chop the delimiter off the front of the working string
                            working = working.substring(delimiter.length);
                            
                            // use the delimiter to identify the type of this token
                            var type = delimiters[delimiter];
                            
                            // make sure the token has a right delimiter
                            type.delimiters[1] = (type.delimiters[1] || ' ');
                            
                            // see if the type delimiter just wants to yield to the exit conditions (ie: wait for a modifier or the end of the string)
                            if(type.delimiters[1]=='*') {
                                if(exit) { 
                                    exit = wrapArray(exit).uniq();
                                } else {
                                    exit = [' '];
                                }
                            } else {
                                exit = wrapArray(type.delimiters[1]);
                            }
                            // parse the token from the working string using the right delimiter or exit condition we came up with above.
                            var out = App.parser.parseToDelimiter(working, exit);
                            
                            // Early retirement!
                            return {
                                working: out.working,
                                type: type.name,
                                value: out.value
                            };
                        }
                    }
                    
                    // Verify the exit conditions
                    if(exit) { 
                        exit = wrapArray(exit).push(' ').uniq();
                    } else {
                        exit = [' '];
                    }                    
                    
                    // If none of the expected types expect delimiters, parse to the exit conditions
                    var out = App.parser.parseToDelimiter(working, exit);
                    var type = App.parser.guessType(out.value, expects);
                    
                    // Update the working string
                    working = out.working;
                    
                    return {
                        working: working,
                        type: type,
                        value: out.value
                    }
                },
                
                parse: function(expression) {
                    /* Overview:
                        This function takes an expression string and tries to parse it to a list of verbs with arguments to be executed (a "parse tree").
                        The main loop of the function iterates until the end of the string, each cycle producing either one token, or nothing. The 
                        function begins with no [verb] set, and starts out by looking for that verb. Once it finds the verb, it sets [verb] to that verb
                        and continues. Each cycle thereafter, it checks to see is [verb] is still set, then proceeds to look for arguments for the verb. 
                        Once it reaches the end of the string, it adds the resulting verb/argument combo to the parse tree and returns.
                    */
                
                
                    var result = []; // an array of verbs w/ arguments that resulted from this parse
                    var working = expression // the "working string" that gets slowly chopped away to nothing
                    var expecting = 'verb';
                    var verb = null; // the verb object we're working on
                    var arguments = {}; /* hash containing the arguments for a verb that were parsed out of this string.  
                                         * (example: 'create event "Practice" on tuesday at 6:30pm' -> { type: 'event', name: 'practice', on: 'tuesday', at: '6:30pm' })
                                         */
                    var modifier = false; // the modifier we're working
                    
                    do {
                        // If we're already working on a verb
                        if(verb) {
                            // If we're working on a modifier (the last token was a modifier)
                            if(modifier) {
                                var expects = verb.expects(arguments); // a hash containing 'takes' and 'modifiers' hashes
                                // If the modifier that the last cycle found is actually expected
                                if(expects.modifiers[modifier]) {
                                    // Grab the type of the modifier and set that as our expected type
                                    expecting = expects.modifiers[modifier];
                                    
                                    // Remove the modifier from our list of expected modifiers
                                    expecting = deleteProperties(expects,modifier);
                                    
                                // If the modifier that the last cycle found isn't actually expected (something bizarre occurred)
                                } else {
                                    // Silently log the error and continue
                                    App.error("The modifier '"+modifier+"' isn't expected by this verb.",true,{expects:expects});
                                    modifier = false;
                                    continue;
                                }
                                
                                // Look for something!
                                var out = App.parser.getToken(working, expecting, Object.keys(expecting));
                                                                                        
                            // If we're not working on a modifier (the last token wasn't a modifier)
                            } else {
                                // Form an array of types we're expecting
                                var expects = verb.expects(arguments); // a hash containing 'takes' and 'modifiers' hashes. 
                                
                                // NOTE: expects = output of verb.expects.
                                //       expecting = value passed to App.parser.getToken, including interim types like modifiers
                                // DON'T MIX UP!!
                                
                                var takes = Object.values(expects.takes).uniq();    /* list of types that "takes" parameters will accept. We'll pass these 
                                                                                     * to App.parser.getToken as expected types, then based on what it comes 
                                                                                     * up with, sort out what parameters the user's trying to pass */
                                var modifiers = Object.keys(expects.modifiers);     /* list of modifier names that are applicable. We'll use these to create
                                                                                     * interim "pseudo-types" to pass to App.parser.getToken to that it can
                                                                                     * look for modifier tokens */
                                expecting = [];
                                expecting = expecting.concat(takes);
                                if(modifiers.length>0) {
                                    (function(modifiers) {
                                        expecting.push(App.types.createInterim({
                                            name:'modifier',
                                            match:function(value) {
                                                return modifiers.contains(value);
                                            }
                                        }));
                                    })(modifiers);
                                }
                                
                                // Look for something!
                                var out = App.parser.getToken(working, expecting);
                                
                                if(out) {
                                    // See if the next item is a regular argument (takes) or a modifier
                                    switch(out.type) {
                                        case 'modifier':
                                            // Remember the modifier for the next cycle
                                            modifier = out.value;
                                            break;
                                        default:
                                            // Try to guess which "takes" parameter this is
                                            takes = Object.invert(expects.takes);
                                            
                                            // If there's a "takes" parameter of the type that we've got, then assume it's that parameter and store it
                                            if(takes[out.type]) {
                                                arguments[takes[out.type]] = out.value
                                            }
                                    }
                                    
                                    // Update the working string
                                    working = out.working;
                                } else {
                                    break;
                                }
                            }
                            continue;
                        }
                        
                        // If we aren't currently working on a verb
                        var out = App.parser.getToken(working, 'verb');
                        if(out) {
                            // Update the working string so we don't loop forever
                            working = out.working;
                            
                            if(out.type=='verb') {
                                // Grab the verb and verify that it's defined
                                verb = App.verbs.get(out.value);
                                
                                // If the verb is defined, continue!
                                if((verb) && (App.interfaces.match(verb,'verb'))) {
                                   continue;
                                    
                                // If the verb is undefined, toss it and keep looking
                                } else {
                                    verb = false;
                                    continue;
                                }
                            }
                        } else {
                            break;
                        }
                                               
                    } while (working.length>0)
                    
                    // If the last cycle produced any verbs, add them to the resulting parse tree
                    if(verb && arguments) {
                        result.push({
                            verb: verb,
                            arguments: arguments
                        });
                    }
                    
                    return result; 
                }
            }
        }(),
        
        search: function() {
            
            return {
                query: function() {
                
                }
            }
        }(),
        
        interfaces: function() {
            
            return {
                /* Checks if [object] matches the interface defined in [interface] */
                match: function(object, interface) {
                    // See if we're given an interface name or an interface definition
                    switch(Ext.type(interface)) {
                        // interface name
                        case 'string':
                            interface = interfaces[interface];
                            break;
                        // interface definition
                        case 'object':
                            break;
                        // something else that doesn't make sense
                        default:
                            interface = null;
                    }
                    
                    // If we've got a valid interface definition of some kind
                    if(interface) {
                        var result = true; // set to false to fail
                        for(var prop in interface) {
                            result = result && App.interfaces.matchType(object[prop], interface[prop]);
                        }
                        return result; 
                    }
                    
                    // If something went wrong (ie: the interface doesn't exist or was defined incorrectly), report failure. :'(
                    return false;
                },
                
                /* Checks if value matches [type] */
                matchType: function(value, type) {
                    var result = true
                    
                    // The value for [type] can be of a number of types
                    switch(Ext.type(type)) {
                       
                        // array for [type] = match any of these types
                        case 'array':
                            result = false; 
                            Ext.each(type,function(item) {
                                result = result || App.interfaces.matchType(value, item);
                            });
                            break; 
                        case 'string':
                            if(type=='bool') {
                                result = (Ext.type(value)=='boolean');
                            } else if((type=='null')||(type=='undefined')) {
                                result = (Ext.type(value)==false);
                            } else {
                                result = (Ext.type(value)==type);
                            }
                            break;
                        case 'function':
                            result = type(value);
                            break;
                    }
                    
                    return result;
                },
                
                /* Register an interface [definition] as [name] */
                create: function(name, definition) {
                    interfaces[name] = definition;
                }
            }
        }(),
        
        
        /* Utility for reporting errors
         * - message (string) : user-friendly error that describes what's gone wrong
         * - silent (bool)    : true to hide the error from the user
         * - data (Mixed)     : any developer-friendly data to be reported. (optional)
         * - code (Mixed)     : code for a developer error message (optional)
         */
        error:function(message, silent, data, code) {
            // does nothing for now
        },
        
        /* Shorthand for the various "get"-ing functions
         *  ex. App.get("type","message"); = App.types.get("message");
         */
        get:function(namespace,name) {
            switch(namespace) {
                case 'type':
                    return App.types.get(name);
                    break;
                case 'noun':
                    return App.nouns.get(name);
                    break;
                case 'verb':
                    return App.verbs.get(name);
                    break;
            }
        },
        
        // public methods
        init: function() {
            Ext.QuickTips.init();
            
            var tabpanel = new Ext.TabPanel({
                items:[{
                    title:'Upcoming',
                    html:'Upcoming items'
                },{
                    title:'Inbox',
                    html:'Inbox'
                }]
            });
            
            new Ext.Viewport({
                layout: 'border',
                items:[{
                    xtype:'panel',
   					border:false,
   					bodyBorder:false,
                    region:'center',
                    layout:'border',
                    items: [{
                        region:'north',
                        border:false,
   						bodyBorder:false,
                        split:false,
                        xtype:'panel',
                        height:0,
                        tbar: ['->', {
                            xtype:'textfield',
                            fieldLabel: 'Command',
                            name: 'to'
                        }, {
                            xtype:'button',
                            text:'Go'
                        }]
                    },{
                        xtype:'panel',
                        split:true,
                        title:'Library',
                        region:'west',
                        minWidth:200,
                        width:200,
                        html:'tree goes here'
                    },{
                        xtype:'panel',
                        split:true,
                        region:'center',
                        layout:'fit',
                        items:[
                            tabpanel
                        ]
                    },{
                        xtype:'panel',
                        split:true,
                        region:'south',
                        title:'details',
                        html:'details go here',
                        minHeight:200,
                        height:200
                    }]
                }]
                
            });
        }
    };
})(); 
 
Ext.onReady(function() {
    App.init();
});
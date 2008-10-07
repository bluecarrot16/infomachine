/* Abstract Types */
App.types.create({
    name: 'item',
    isPrimitive: false,
    isHidden: true,
    properties: {
    
    },
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { 
        if(App.types.get(value)) {
            return true;
        }
        return false;
    },
    creation: function() {
        return {
            takes: {
            },
            modifiers: {
            }
        };
    }
});


App.types.create({
    name: 'type',
    isPrimitive: false,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { 
        if(App.types.get(value)) {
            return true;
        }
        return false;
    },
    creation: function() {
        return {
            takes: {
            },
            modifiers: {
            }
        };
    }
});

App.types.create({
    name: 'verb',
    isPrimitive: false,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { 
        if(App.verbs.get(value)) {
            return true;
        }
        return false;
    },
    creation: function() {
        return {
            takes: {
            },
            modifiers: {
            }
        };
    }
});

App.types.create({
    name: 'anything',
    isPrimitive: false,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { 
        return true;
    },
    creation: function() {
        return {
            takes: {
            },
            modifiers: {
            }
        };
    }
});

/* Primitive Types */


App.types.create({
    name: 'text',
    isPrimitive: true,
    isHidden: true,
    properties: null,
    delimiters:['"','"'],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function() { }
});

App.types.create({
    name: 'number',
    isPrimitive: true,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { }
});

App.types.create({
    name: 'date',
    isPrimitive: true,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { }
});

App.types.create({
    name: 'url',
    isPrimitive: true,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { }
});

App.types.create({
    name: 'color',
    isPrimitive: true,
    isHidden: true,
    properties: null,
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { 
        
    },
    suggest: function(input) { 
        
    },
    match: function(value) { 
        value = value.strip();
        if(value.startsWith('#')) {
            out = toNumbers(value.substr(1,6));
            if(out.length>0) {
                return true;
            }
        } else {
            if(App.types.get('color').colors.includes(value)) {
                return true;
            }
        }
        return false;
    },
    colors: ["red", "orange", "yellow", "green", "blue", "violet", "black", "white",
   "grey", "brown", "beige", "magenta", "cerulean", "puce"]
});


/* Reference Types */

App.types.create({
    name: 'event',
    isPrimitive: false,
    isHidden: false,
    properties: {
        on:'date',
        at:'date',
        name:'text'
    },
    delimiters:[' ',' '],
    icon: null,
    color: '#fbfbfb',
    interface: { },
    serialize: function() { },
    suggest: function(input) { },
    match: function(value) { },
    creation: function() {
        return {
            takes: {
                'name':'text'
            },
            modifiers: {
                'on':'date',
                'at':'date'
            }
        };
    }
});


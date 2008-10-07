/*
App.verbs.create({
    name: '',
    takes: {},
    modifiers: {}
});
*/


App.verbs.create({
    name: 'create',
    takes: function(args) {
        if(args['type']) {
            var type = App.types.get(args['type']);
            if(type) {
                if(type.create) {
                    var takes = type.creation().takes;
                    takes['type'] = 'type';
                    takes = deleteProperties(Object.keys(args),modifiers); // remove properties that have already been defined
                    return modifiers;
                }
            }
        }
        return { 'type': 'type' };
    },
    modifiers: function(args) {
        if(args['type']) {
            var type = App.types.get(args['type']);
            if(type) {
                if(type.creation) {
                    var modifiers = type.creation().modifiers;
                    modifiers = deleteProperties(Object.keys(args),modifiers); // remove modifiers that have already been defined
                    return modifiers;
                }
            }
        }
        return { };
    },
    expects: function(args) {
        if(args['type']) {
            var type = App.types.get(args['type']);
            if(type) {
                if(type.creation) {
                    var creation = type.creation();
                    
                    // omit the properties that the parser has already found
                    creation.modifiers = deleteProperties(Object.keys(args),creation.modifiers); // remove modifiers that have already been defined
                    creation.takes = deleteProperties(Object.keys(args),creation.modifiers); // remove properties that have already been defined 
                    
                    return creation;
                }
            }
        } else {
            return {takes: {'type':'type'}, modifiers:{ } };
        }
    }
});

App.interfaces.create('type',{
    name: 'string',
    isPrimitive: 'boolean',
    isHidden: 'boolean',
    properties: ['object','null'],
    delimiters:['array', 'null'],
    icon: ['string','null'],
    color: ['string','null'],
    interface: 'object',
    serialize: 'function',
    suggest: 'function',
    match: 'function',
    creation: 'function'
});

App.interfaces.create('verb',{
    name: 'string',
    takes: ['null','function'],
    modifiers: ['null','function'],
    expects: 'function'
});
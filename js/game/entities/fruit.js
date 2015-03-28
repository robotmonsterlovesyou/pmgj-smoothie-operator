define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    function Fruit(world, options) {

        var fruit = new Entity(world, Facade.Circle({
                radius: 15,
                fillStyle: 'red',
                anchor: 'center'
            }),
            options,
            {
                type: 'dynamic',
                rotate: true,
                density: 1.0,
                restitution: 1.0
            }
        );

        return fruit;
    };

    return Fruit;
});

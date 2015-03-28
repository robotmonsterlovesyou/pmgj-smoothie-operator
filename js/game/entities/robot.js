define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    function Robot(world, options) {

        var robot = new Entity(world, Facade.Circle({
                radius: 30,
                fillStyle: 'gray',
                anchor: 'center'
            }),
            options,
            {
                type: 'dynamic',
                rotate: true,
                density: 5.0,
                restitution: 0.75
            }
        );

        return robot;
    };

    return Robot;
});

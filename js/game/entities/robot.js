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
                density: 1.0,
                restitution: 1.0
            }
        );

        return robot;
    };

    return Robot;
});

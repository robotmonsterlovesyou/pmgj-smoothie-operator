define(function (require) {

    var Facade = require('facade');

    require('facadejs-Box2D-plugin');

    return function (world, options) {

        var fruit = new Facade.Circle({ radius: 15, fillStyle: 'red' });

        fruit.setOptions(options);

        fruit.Box2D('createObject', world, {
            type: 'dynamic',
            rotate: true,
            density: 1.0,
            restitution: 1.0
        });

        return fruit;

    }

});

define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    function Fruit(world, options) {

        var circle = Facade.Circle({
            radius: 30,
            fillStyle: 'red',
            anchor: 'center'
        })

        var fruit = new Entity(
            world,
            circle,
            options,
            {
                type: 'dynamic',
                rotate: true,
                density: 1.0,
                restitution: 1.0
            }
        );

        circle.parent = fruit
        fruit.objectType = "fruit"

        return fruit;
    };

    return Fruit;
});

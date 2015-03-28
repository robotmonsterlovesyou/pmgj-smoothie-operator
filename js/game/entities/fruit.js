define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    function Fruit(world, type, options) {

        var circle = Facade.Circle({
            radius: 20,
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


        fruit.body._parent = fruit
        fruit.objectType = "fruit"

        console.log(fruit.body._parent)
        
        return fruit;
    };

    return Fruit;
});

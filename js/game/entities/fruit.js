define(function (require) {

    'use strict';

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    var fruitImgs = {
        apple: 'apple.png',
        banana: 'banana.png',
        orange: 'orange.png',
        strawberry: 'strawberry.png',
        blueberry: 'blueberry.png'
    };

    function Fruit(world, type, options) {

        this.type = type;

        var f = new Facade.Circle({
                radius: 30,
                fillStyle: 'red',
                anchor: 'center'
            });
        if (this.type) f = new Facade.Image({
                image: fruitImgs[this.type],
                anchor: 'center'
            });
        var fruit = new Entity(world, f, options, {
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

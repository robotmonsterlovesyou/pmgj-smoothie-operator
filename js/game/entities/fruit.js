define(function (require) {

    'use strict';

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    var fruitImgs = {
        apple: 'fruit_2.png',
        banana: 'fruit_4.png',
        orange: 'fruit_3.png',
        strawberry: 'fruit_1.png',
        blueberry: 'fruit_5.png'
    };

    function Fruit(world, type, options) {

        type = type || 'apple';
        options = options || {};

        var body = new Facade.Circle({
            radius: 20,
            anchor: 'center',
            fillStyle: 'rgba(0, 0, 0, 0)'
        });


        var fruit = new Entity(world, body, options, {
                type: 'dynamic',
                rotate: true,
                density: 1.0,
                restitution: 1.0
            }
        );

        fruit.type = type;
        fruit.img = new Facade.Image( 'blender_images/' + fruitImgs[type], { anchor: 'center' });
        fruit.imgHighlight = new Facade.Image( 'blender_images/fruit_highlights.png', { anchor: 'center' });

        fruit.draw = function (stage) {

            var pos = this.getPosition(),
                rotate = this.body.getOption('rotate');
            stage.addToStage(fruit.img, { x: pos.x, y: pos.y, rotate: rotate });
            stage.addToStage(fruit.imgHighlight, { x: pos.x, y: pos.y });
        };

        return fruit;
    };



    return Fruit;
});

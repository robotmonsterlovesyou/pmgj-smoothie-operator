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

    function randomFruitType() {

        var keys = Object.keys(fruitImgs);
        return keys[Math.floor(Math.random() * keys.length)];
    };

    function Fruit(world, type, options) {

        if (type in fruitImgs === false) type = randomFruitType();
        options = options || {};

        var body = new Facade.Circle({
            radius: 27,
            anchor: 'center',
            fillStyle: 'rgba(0, 0, 0, 0)'
        });

        var fruit;
        if (world) {
            fruit = new Entity(world, body, options, {
                type: 'dynamic',
                rotate: true,
                density: 1.0,
                restitution: 1.0
            });
        } else {
            fruit = {};
        }

        fruit.type = type;
        fruit.img = new Facade.Image('blender_images/' + fruitImgs[type], { anchor: 'center' });
        fruit.imgHighlight = new Facade.Image('blender_images/fruit_highlights.png', { anchor: 'center' });
        fruit.imgShadow = new Facade.Image('blender_images/fruit_shadow.png', { anchor: 'center' });

        fruit.draw = function (stage, shadowY) {

            var pos = this.getPosition(),
                rotate = this.body.getOption('rotate') || 0;

            stage.addToStage(fruit.imgShadow, { x: pos.x, y: shadowY, scale: 1 - (shadowY - pos.y) / shadowY * 0.7 });
            stage.addToStage(fruit.img, { x: pos.x, y: pos.y, rotate: rotate });
            if (this.type !== 'banana') {
                stage.addToStage(fruit.imgHighlight, { x: pos.x, y: pos.y });
            }

        };

        return fruit;
    };

    return Fruit;
});

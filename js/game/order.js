define(function (require) {

    'use strict';

    var Facade = require('facade'),
        Fruit = require('./entities/fruit');

    var imgBubble = new Facade.Image('blender_images/patrons_bubble.png', { anchor: 'center' }),
        imgHighlight = new Facade.Image('blender_images/fruit_highlights.png', { anchor: 'center' });

    function Order(number) {

        this.number = number;
        this.fruits = [];

        for (var i = 0; i < this.number; i += 1) {
            this.fruits.push(new Fruit());
        }
    };

    Order.prototype.check = function (fruits) {

        // if passed fruits are same as this.fruits, return true
        fruits.sort();
        this.fruits.sort();
        if (JSON.stringify(fruits) === JSON.stringify(this.fruits)) return true;
        else return false;
    };

    Order.prototype.draw = function (stage, offset, maxOrders) {

        var size = { x: 200, y: 0 },
            x = this.number * size.x + offset.x,
            fruitOffset = [
                { x: 20, y: -40 },
                { x: 30, y: 30 },
                { x: -40, y: 10 },
            ];

        // draw customer

        // draw speech bubble
        stage.addToStage(imgBubble, { x: x, y: offset.y});

        // draw fruits in bubble
        for (var f = 0; f < this.fruits.length; f += 1) {
            stage.addToStage(this.fruits[f].img, {
                x: x + fruitOffset[f].x,
                y: offset.y - fruitOffset[f].y
            });
            if (this.fruits[f].type !== 'banana') {
                stage.addToStage(this.fruits[f].imgHighlight, {
                    x: x + fruitOffset[f].x,
                    y: offset.y - fruitOffset[f].y
                });
            }
        }
    };

    return Order;
});

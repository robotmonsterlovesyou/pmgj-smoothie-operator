define(function (require) {

    'use strict';

    var Facade = require('facade'),
        Fruit = require('./entities/fruit');

    var game = require('./game');

    var PersonEntity = require('./entities/person');

    var imgBubble = new Facade.Image('blender_images/patrons_bubble.png', { anchor: 'center' }),
        imgHighlight = new Facade.Image('blender_images/fruit_highlights.png', { anchor: 'center' });

    function Order(number) {

        this.number = number;
        this.fruits = [];

        this.offsetX = (this.number * 260 + 110);

        this.customer = new PersonEntity(Math.floor(Math.random() * 3), { x: '+=' + this.offsetX });

        for (var i = 0; i < 3; i += 1) {
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

    Order.prototype.beforeTruckDraw = function (stage, offset) {

        game.stage.addToStage(this.customer.entities.face, { y: '+=' + offset.y });

    };

    Order.prototype.afterTruckDraw = function (stage, offset) {

        var size = { x: 240, y: 0 },
            bubbleOffsetX = 280,
            bubbleOffsetY = 80,
            fruitOffset = [
                { x: 20, y: -40 },
                { x: 30, y: 30 },
                { x: -40, y: 10 },
            ];

        game.stage.addToStage(this.customer.entities.arms, { y: '+=' + offset.y });

        // draw speech bubble
        stage.addToStage(imgBubble, { x: this.offsetX + bubbleOffsetX, y: offset.y + bubbleOffsetY });

        // draw fruits in bubble
        for (var f = 0; f < this.fruits.length; f += 1) {
            stage.addToStage(this.fruits[f].img, {
                x: this.offsetX + fruitOffset[f].x + bubbleOffsetX,
                y: offset.y + bubbleOffsetY - fruitOffset[f].y
            });
            if (this.fruits[f].type !== 'banana') {
                stage.addToStage(this.fruits[f].imgHighlight, {
                    x: this.offsetX + fruitOffset[f].x + bubbleOffsetX,
                    y: offset.y + bubbleOffsetY - fruitOffset[f].y
                });
            }
        }
    };

    return Order;
});

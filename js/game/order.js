define(function (require) {

    'use strict';

    var Facade = require('facade'),
        Fruit = require('./entities/fruit');

    var game = require('./game');

    var PersonEntity = require('./entities/person');

    var imgBubble = new Facade.Image('blender_images/patrons_bubble.png', { anchor: 'center' }),
        imgHighlight = new Facade.Image('blender_images/fruit_highlights.png', { anchor: 'center' });

    var ORDER_WAIT_TIME = 60000;
    var MIN_WAIT_TIME = 10000;

    function Order(number) {

        this.number = number;
        this.fruits = [];
        this.timestamp = window.performance.now();

        this.waitTime = ORDER_WAIT_TIME;

        this.offsetX = (this.number * 260 + 110);

        this.customer = new PersonEntity(Math.floor(Math.random() * 3), { x: '+=' + this.offsetX });

        for (var i = 0; i < 3; i += 1) {
            this.fruits.push(new Fruit());
        }
    };

    Order.prototype.getWaitTime = function () {

        return this.waitTime;
    };

    Order.prototype.getMinWaitTime = function () {

        return MIN_WAIT_TIME;
    };

    Order.prototype.isExpired = function () {

        return (this.timestamp + this.waitTime) < window.performance.now();
    };

    Order.prototype.getPointValue = function () {

        var points = Math.floor((this.timestamp + this.waitTime - window.performance.now()) / 1000) * 10;
        return points > 0 ? points : -1;
    };

    Order.prototype.cleanup = function () {

        ORDER_WAIT_TIME -= 3000;
    };

    // if passed fruits are same as this.fruits, return true
    Order.prototype.check = function (fruits) {

        var keys = Object.keys(this.fruits),
            orderTypes = [];
        for (var key = 0; key < keys.length; key += 1) {
            orderTypes.push(this.fruits[keys[key]].type);
        }

        orderTypes.sort();
        fruits.sort();

        if (JSON.stringify(orderTypes) === JSON.stringify(fruits)) return true;
        else return false;
    };

    Order.prototype.beforeTruckDraw = function (stage, offset) {
        this.customer.entities.timer.setText(Math.floor((this.timestamp + this.waitTime - window.performance.now()) / 1000));
        this.customer.drawFace(stage, offset.y);

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

        if (parseFloat(this.customer.entities.timer.value) <= 10) {

            game.stage.addToStage(this.customer.entities.timer, { y: '+=' + offset.y });

        }

        if (this.customer.state.satisfied) {

            game.stage.addToStage(this.customer.entities.victory, { y: '+=' + offset.y });

        } else {

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

        }
    };

    return Order;
});

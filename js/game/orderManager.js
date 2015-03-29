define(function (require) {

    'use strict';

    var Howl = require('howler').Howl;

    var Order = require('./order');
    var ui = require('./entities/ui');

    var slurpSFX = [
        new Howl({ urls: ['./sfx/slurp_01.mp3'], volume: 1 }),
        new Howl({ urls: ['./sfx/slurp_02.mp3'], volume: 1 }),
        new Howl({ urls: ['./sfx/slurp_03.mp3'], volume: 1 })
    ];

    function OrderManager() {

        this.orders = [];
        this.orderMax = 3;
        this.activeFruits = [];
    };

    OrderManager.prototype.createOrder = function () {

        var keys = Object.keys(this.orders),
            available = [0, 1, 2];

        for (var key = 0; key < keys.length; key += 1) {
            delete available[keys[key]];
        }

        var availableKeys = Object.keys(available);
        if (availableKeys.length > 0) {
            var newKey = Math.floor(Math.random() * availableKeys.length);
            this.orders[availableKeys[newKey]] = new Order(availableKeys[newKey]);
        }
    };

    OrderManager.prototype._fulfillOrder = function (id) {

        var points = this.orders[id].getPointValue();
        console.log('Order ' + id + ' fulfilled! ' + points + ' points');
        this.orders[id].customer.setSatisfied();

        setTimeout((function (id) {
            this.orders[id].customer.state.cleanup = true;
        }).bind(this, id), 500);

        setTimeout(function () {
            slurpSFX[Math.round(Math.random() * (slurpSFX.length -1))].play();
        }, 500);

        return points;
    };

    // returns points awarded if an order was fulfilled
    // returns -1 if no orders fulfilled
    OrderManager.prototype.checkOrders = function (fruits) {

        var keys = Object.keys(this.orders);
        for (var key = 0; key < keys.length; key += 1) {
            if (this.orders[keys[key]].check(fruits)) {
                return this._fulfillOrder(keys[key]);
            }
        }
        return -1;
    };

    // returns an array of fruits that are needed and are not currently
    //   on the board
    OrderManager.prototype.getNeededFruits = function (existingFruits) {

        var orderFruits = [];
        var oldFruits = existingFruits.slice(0);

        for (var order in this.orders) {
            for(var fruit in this.orders[order].fruits) {
                orderFruits.push(this.orders[order].fruits[fruit].type);
            }
        }

        for (var fruit in oldFruits) {
            var found = orderFruits.indexOf(oldFruits[fruit].type);
            if (found !== -1) orderFruits.splice(found, 1);
        }

        return orderFruits;
    }

    OrderManager.prototype.checkExpired = function () {

        var keys = Object.keys(this.orders);
        for (var key = 0; key < keys.length; key += 1) {
            if (this.orders[keys[key]].isExpired()) {
                // kill off customer
                delete this.orders[keys[key]];
                // make the robot lose one life with the result
                return true;
            }
        }
        return false;
    };

    OrderManager.prototype.runCleanup = function () {

        var keys = Object.keys(this.orders);
        for (var key = 0; key < keys.length; key += 1) {
            if (this.orders[keys[key]].customer.state.cleanup !== undefined) {
                // kill off customer
                delete this.orders[keys[key]];
            }
        }
        return false;
    };

    OrderManager.prototype.keepOrdersPossible = function () {

        // check active fruits
        // make sure there are active fruits for the current orders
    }

    OrderManager.prototype.beforeTruckDraw = function (stage, truckOffset) {

        var offset = { y: truckOffset },
            keys = Object.keys(this.orders);

        for (var key = 0; key < keys.length; key += 1) {
            this.orders[keys[key]].beforeTruckDraw(stage, offset);
        }
    };

    OrderManager.prototype.afterTruckDraw = function (stage, truckOffset) {

        var offset = { y: truckOffset },
            keys = Object.keys(this.orders);

        for (var key = 0; key < keys.length; key += 1) {
            this.orders[keys[key]].afterTruckDraw(stage, offset);
        }
    };

    return OrderManager;
});

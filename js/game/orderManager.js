define(function (require) {

    'use strict';

    var Order = require('./order');

    function OrderManager() {

        this.orders = [];
        this.orderMax = 3;
        this.activeFruits = [];
    };

    OrderManager.prototype.createOrder = function () {

        if (this.orders.length < this.orderMax) {
            this.orders.push(new Order(3));
        }
console.log(this);
    };

    OrderManager.prototype._fulfillOrder = function (id) {

        this.orders.splice();
    };

    OrderManager.prototype.checkOrders = function (fruits) {


    };

    OrderManager.prototype.keepOrdersPossible = function () {

        // check active fruits
        // make sure there are active fruits for the current orders
    }

    OrderManager.prototype.draw = function (stage, truckOffset) {

        var offset = { x: 300, y: 100 + truckOffset },
            keys = Object.keys(this.orders);
        for (var i = 0; i < keys.length; i += 1) {
            this.orders[i].draw(stage, offset, this.orderMax);
        }
    };

    return OrderManager;
});

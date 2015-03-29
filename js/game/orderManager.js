define(function (require) {

    'use strict';

    var Order = require('./order');

    function OrderManager() {

        this.orders = [];
        this.orderMax = 3;
        this.activeFruits = [];
    };

    OrderManager.prototype.createOrder = function () {

        var keys = Object.keys(this.orders),
            available = [];

        if (this.orders.length < this.orderMax) {
            this.orders.push(new Order(2));
        }
//console.log(this);
    };

    OrderManager.prototype._fulfillOrder = function (id) {

console.log('Order ' + id + ' fulfilled!');
        delete this.orders[id];
    };

    OrderManager.prototype.checkOrders = function (fruits) {

        var keys = Object.keys(this.orders);
        for (var key = 0; key < this.orders.length; key += 1) {
            if (order.check(fruits)) this._fulfillOrder(key);
        }
    };

    OrderManager.prototype.keepOrdersPossible = function () {

        // check active fruits
        // make sure there are active fruits for the current orders
    }

    OrderManager.prototype.draw = function (stage, truckOffset) {

        var offset = { x: 390, y: 100 + truckOffset },
            keys = Object.keys(this.orders);
        for (var i = 0; i < keys.length; i += 1) {
            this.orders[i].draw(stage, offset);
        }
    };

    return OrderManager;
});

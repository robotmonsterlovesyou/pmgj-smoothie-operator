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
            this.orders.push(new Order(1));
        }
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

    OrderManager.prototype.beforeTruckDraw = function (stage, truckOffset) {

        var offset = { y: truckOffset },
            keys = Object.keys(this.orders);

        for (var i = 0; i < keys.length; i += 1) {
            this.orders[i].beforeTruckDraw(stage, offset);
        }
    };

    OrderManager.prototype.afterTruckDraw = function (stage, truckOffset) {

        var offset = { y: truckOffset },
            keys = Object.keys(this.orders);

        for (var i = 0; i < keys.length; i += 1) {
            this.orders[i].afterTruckDraw(stage, offset);
        }
    };

    return OrderManager;
});

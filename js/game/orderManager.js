(function () {

    'use strict';

    function OrderManager() {

        this.orders = [];
        this.orderMax = 3;
        this.activeFruits = [];
    };

    OrderManager.prototype.createOrder = function () {

        if (this.orders.length < this.ordersMax) {
            this.orders.push(new Order(Math.random() * 3 + 1));
        }
    };

    OrderManager.prototype.fulfillOrder = function () {


    };

    OrderManager.prototype.checkOrders = function (fruits) {


    };

    OrderManager.prototype.keepOrdersPossible = function () {

        // check active fruits
        // make sure there are active fruits for the current orders
    }

    OrderManager.prototype.draw = function (stage) {

        var keys = Object.keys(this.orders);
        for (var i = 0; i < keys.length; i += 1) {
            orders[i].draw(stage, this.orderMax);
        }
    };

    return OrderManager;
});

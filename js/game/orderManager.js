(function () {

    'use strict';

    function OrderManager() {

        this.orders = [];
    };

    OrderManager.prototype.checkOrders() {

    };

    OrderManager.prototype.draw() {

        var keys = Object.keys(this.orders);
        for (var i = 0; i < keys.length; i += 1) {
            orders[i].draw();
        }
    };

    return OrderManager;
});

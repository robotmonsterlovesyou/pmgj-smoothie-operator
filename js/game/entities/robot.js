define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    function Robot(world, options) {

        var robot = new Entity(world, Facade.Circle({
                radius: 30,
                fillStyle: 'gray',
                anchor: 'center'
            }),
            options,
            {
                type: 'dynamic',
                rotate: true,
                density: 5.0,
                restitution: 0.75
            }
        );

        robot.fruits = ['banana', 'blueberry'];


        return robot;
    };

    // returns true if order was delivered
    Robot.prototype.deliverOrder = function(order) {

        if (order.check(this.fruits)) {
            // order matched and delivered
            robot.score += fruits.length;
            robot.fruits = [];
            return true;
        } else {
            // order did not match
            return false;
        }
    };

    Robot.prototype.watchFruits = function(fruits) {
        console.log(fruits);
    };

    return Robot;
});

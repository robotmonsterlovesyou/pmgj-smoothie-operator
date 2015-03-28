define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    require('facadejs-Box2D-plugin');

    function Robot(world, options) {

        var FRUIT_RADIUS = 27
        var ROBOT_RADIUS = 50

        var robot = new Entity(world, Facade.Circle({
                radius: ROBOT_RADIUS,
                fillStyle: 'gray',
                anchor: 'center'
            }),
            options,
            {
                type: 'dynamic',
                density: 5.0,
                restitution: 0.0
            }
        );

        robot.fruits = ['banana', 'blueberry'];

        robot.collidingFruits = []

        robot.addCollidingFruit = function(fruit) {
            robot.collidingFruits.push(fruit)
        }

        robot.checkFruits = function(fruits) {
            robot.collidingFruits = [];

            var robotLocation

            robotLocation = robot.getPosition()

            fruits.forEach(function(fruit) {
                var fruitPosition = fruit.getPosition();

                var xDist = robotLocation.x - fruitPosition.x
                var yDist = robotLocation.y - fruitPosition.y

                var totalDistance = Math.sqrt( xDist*xDist + yDist*yDist );

                if (totalDistance < (FRUIT_RADIUS + ROBOT_RADIUS)) {
                    robot.addCollidingFruit(fruit)
                }
            });
        }

        robot.blendFruit = function() {
            robot.collidingFruits.forEach(function(fruit) {
            });
        }

        robot.img = new Facade.Image( 'blender_images/blender_body.png', { anchor: 'center' });

        robot.draw = function (stage) {

            var pos = this.getPosition(),
                rotate = this.body.getOption('rotate');
            stage.addToStage(robot.img, { x: pos.x - 5, y: pos.y, rotate: rotate });
        };

        // returns true if order was delivered
        robot.deliverOrder = function(order) {

            if (order.check(this.fruits)) {
                // order matched and delivered
                robot.score += this.fruits.length;
                robot.fruits = [];
                return true;
            } else {
                // order did not match
                return false;
            }
        };

        robot.watchFruits = function(fruits) {
            console.log(fruits);
        };

        return robot;
    };

    return Robot;
});

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

        robot.jumping = false;
        robot.jumpCount = 0;

        robot.jump = function() {
            if (robot.getPosition().y > 440) {
                console.log("jump")
                
                robot.jumpCount = 0;
                robot.jumping = true;
            }
        }

        robot.turnLeft = function() {

        }

        robot.turnRight = function() {

        }

        robot.blendFruit = function() {
            robot.collidingFruits.forEach(function(fruit) {
                // HERE
            });
        }

        robot.img = new Facade.Image( 'blender_images/blender_body.png', { anchor: 'center' });


        var leg1 = {
            bodyJoint: new Facade.Image( 'blender_images/blender_smalljoint1.png', { anchor: 'center' }),
            top: new Facade.Image( 'blender_images/blender_leg_upper.png', { anchor: 'top' }),
            legJoint: new Facade.Image( 'blender_images/blender_smalljoint2.png', { anchor: 'center' }),
            bottom: new Facade.Image( 'blender_images/blender_leg_lower.png', { anchor: 'center' }),

        }

        var leg2 = {
            bodyJoint: new Facade.Image( 'blender_images/blender_smalljoint1.png', { anchor: 'center' }),
            top: new Facade.Image( 'blender_images/blender_leg_upper.png', { anchor: 'top' }),
            legJoint: new Facade.Image( 'blender_images/blender_smalljoint2.png', { anchor: 'center' }),
            bottom: new Facade.Image( 'blender_images/blender_leg_lower.png', { anchor: 'center' }),
        }

        var JUMP_MAX = 10
        robot.update = function() {
            if (robot.jumping == true) {
                robot.jumpCount += 1;
                console.log("jumping!");
                if (robot.jumpCount > JUMP_MAX) {
                    robot.setVelocity(null, -15);
                    robot.jumping = false
                    robot.jumpCount = 0

                }
                    console.log("jump: " + robot.jumpCount)
            }
        }

        bottomOrange = new Facade.Image( 'blender_images/fruit_3_blended1.png', {anchor: 'center'});
        bottomYellow = new Facade.Image( 'blender_images/fruit_2_blended1.png', {anchor: 'center'});
        bottomGreen = new Facade.Image( 'blender_images/fruit_1_blended1.png', {anchor: 'center'});

        function drawLeg (stage, leg, x, y, multi, jumpCount) {
            leg.x = x
            leg.y = y


            stage.addToStage(leg.bodyJoint, { x: leg.x, y: leg.y + (jumpCount * 2.5)});
            stage.addToStage(leg.top, { x: leg.x - 5, y: leg.y + (jumpCount * 2.5)  , rotate: (jumpCount*4) + 50 * multi});
            stage.addToStage(leg.bottom, { x: leg.x - 30 * multi, y: leg.y + 35, rotate: 10 * multi});
            stage.addToStage(leg.legJoint, { x: leg.x - 25 * multi, y: leg.y + 20});
        }

        robot.draw = function (stage) {


            var pos = this.getPosition(),
                rotate = this.body.getOption('rotate');

                pos.y = pos.y - 20

            var robotY = pos.y
            if (robot.jumping) {
                robotY = robotY + (robot.jumpCount*2.5)
            }

            // back
            drawLeg(stage, leg1, pos.x + 40, pos.y + 55, -1, robot.jumpCount)
            drawLeg(stage, leg2, pos.x + 25, pos.y + 50, -1, robot.jumpCount)
            drawLeg(stage, leg1, pos.x + 10, pos.y + 45, -1, robot.jumpCount)
            
            stage.addToStage(robot.img, { x: pos.x - 5, y: robotY, rotate: rotate });
            stage.addToStage(bottomOrange, { x: pos.x - 4, y: pos.y + robot.jumpCount*2.5})
            stage.addToStage(bottomYellow, { x: pos.x - 6, y: pos.y - 25 + robot.jumpCount*2.5})
            stage.addToStage(bottomGreen, { x: pos.x - 8, y: pos.y - 50 + robot.jumpCount*2.5})

            drawLeg(stage, leg1, pos.x - 40, pos.y + 50, 1, robot.jumpCount)
            drawLeg(stage, leg2, pos.x - 25, pos.y + 55, 1, robot.jumpCount)
            drawLeg(stage, leg1, pos.x - 10, pos.y + 60, 1, robot.jumpCount)
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

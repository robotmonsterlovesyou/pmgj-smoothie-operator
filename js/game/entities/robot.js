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
        robot.jumpCanFinish = false

        robot.startJump = function() {
            if (robot.getPosition().y > 440) {
                robot.jumping = true;
                robot.jumpCanFinish = false;
            }
        }

        robot.finishJump = function() {
            robot.jumpCanFinish = true
        }

        robot.resetWalking = function() {
            robot.isWalking = false
        }

        robot.walkLeft = function() {
            robot.isWalking = true
        }

        robot.walkRight = function() {
            robot.isWalking = true
        }

        robot.blendFruit = function() {
            robot.collidingFruits.forEach(function(fruit) {
                // HERE
            });
        }

        robot.img = new Facade.Image( 'blender_images/blender_body.png', { anchor: 'center' });

        var leg1 = {
            bodyJoint: new Facade.Image( 'blender_images/blender_smalljoint2.png', { anchor: 'center' }),
            top: new Facade.Image( 'blender_images/blender_leg_upper.png', { anchor: 'top' }),
            legJoint: new Facade.Image( 'blender_images/blender_smalljoint2.png', { anchor: 'center' }),
            bottom: new Facade.Image( 'blender_images/blender_leg_lower.png', { anchor: 'top' }),

        }

        var leg2 = {
            bodyJoint: new Facade.Image( 'blender_images/blender_smalljoint2.png', { anchor: 'center' }),
            top: new Facade.Image( 'blender_images/blender_leg_upper.png', { anchor: 'top' }),
            legJoint: new Facade.Image( 'blender_images/blender_smalljoint2.png', { anchor: 'center' }),
            bottom: new Facade.Image( 'blender_images/blender_leg_lower.png', { anchor: 'top' }),
        }

        var phaseTotal = 2
        robot.walking = false
        robot.walkCount = 0
        robot.walkPhase = 0

        var JUMP_MAX = 10

        robot.update = function() {

            if (robot.isWalking) {
                if (robot.walkPhase == 0) {
                    robot.walkPhase = 1
                }

                robot.walkCount += 0.5
                if (robot.walkCount > 10) {
                    robot.walkCount = 0

                    robot.walkPhase += 1
                    if (robot.walkPhase > phaseTotal) {
                        robot.walkPhase = 1
                    } 
                }
            } else {
                robot.walkPhase = 0
            }

            if (robot.jumping == true) {
                robot.jumpCount += 1;
                if (robot.jumpCount > JUMP_MAX) {
                    robot.jumpCount = JUMP_MAX
                    robot.jumping = false
                }
            }

            if (robot.jumping == false && robot.jumpCanFinish == true && robot.jumpCount == JUMP_MAX) {
                robot.setVelocity(null, -18);
                robot.jumpCanFinish = false;
                robot.jumpCount = 0;
            }
        }

        bottomOrange = new Facade.Image( 'blender_images/fruit_3_blended1.png', {anchor: 'center'});
        bottomYellow = new Facade.Image( 'blender_images/fruit_2_blended1.png', {anchor: 'center'});
        bottomGreen = new Facade.Image( 'blender_images/fruit_1_blended1.png', {anchor: 'center'});

        function drawLeg (stage, leg, x, y, multi, backLeg, jumpCount, walkCount, walkPhase, middle) {
            leg.x = x
            leg.y = y


            if (middle && walkPhase != 0) {
                walkPhase = walkPhase + 1

                if (walkPhase > phaseTotal) {
                    walkPhase = 1
                }
            }

            // top joint ()
            var aX = leg.x
            var aY = leg.y + (jumpCount * 2.5)
            if (backLeg) {
                aY = leg.y + (jumpCount * 2)
            }

            // top leg ====
            var bX = leg.x - 5 + (jumpCount * 0.5)
            var bY = leg.y + (jumpCount * 2.0)
            var bRotate = (jumpCount*5) + 50 * multi
            if (backLeg) {
                bX = leg.x - 5 + (jumpCount*0.1*multi)
                bY = leg.y + (jumpCount * 2.8)
                bRotate = (jumpCount*5 * multi) + 50 * multi
            }

            // knee ()
            var dX = leg.x - 25 * multi
            var dY = leg.y + 20
            
            // bottom leg ===>
            var cX = leg.x - 30 * multi
            var cY = leg.y + 20
            var cRotate = 10 * multi
            if (backLeg) {
                cX = leg.x - 22 * multi
            }
            if (walkPhase > 0) {
                if (walkPhase == 1) {
                    if (backLeg) {
                        cRotate = 10 * multi + (walkCount * -4)
                    } else {
                        cRotate = 20 * multi + ((10-walkCount) * -4)
                    }
                } else if (walkPhase == 2) {
                    if (backLeg) {
                        cRotate = 10 * multi + ((10-walkCount) * -4)
                    } else {
                        cRotate = 20 * multi + (walkCount * -4)
                    }
                } 
            }

            
            if (backLeg) {
                stage.addToStage(leg.bodyJoint, { x: aX , y: aY});
                stage.addToStage(leg.bottom, { x: cX, y: cY, rotate: cRotate});
                stage.addToStage(leg.legJoint, { x: dX, y: dY}); 
                stage.addToStage(leg.top, { x: bX, y: bY, rotate: bRotate});
            } else {
                stage.addToStage(leg.bodyJoint, { x: aX , y: aY});
                stage.addToStage(leg.top, { x: bX, y: bY, rotate: bRotate});
                stage.addToStage(leg.bottom, { x: cX, y: cY, rotate: cRotate});
                stage.addToStage(leg.legJoint, { x: dX, y: dY}); 
            }
        }

        robot.draw = function (stage) {
            var pos = this.getPosition(),
            rotate = this.body.getOption('rotate');

            pos.y = pos.y - 45

            var robotY = pos.y
            robotY = robotY + (robot.jumpCount*2.5)

            var walkCount = robot.walkCount
            var walkPhase = robot.walkPhase

            // back
            drawLeg(stage, leg1, pos.x + 40, pos.y + 55, -1, true, robot.jumpCount, walkCount, walkPhase, false)
            drawLeg(stage, leg2, pos.x + 25, pos.y + 50, -1, true, robot.jumpCount, walkCount, walkPhase, true)
            drawLeg(stage, leg1, pos.x + 10, pos.y + 45, -1, true, robot.jumpCount, walkCount, walkPhase, false)
            
            stage.addToStage(robot.img, { x: pos.x - 5, y: robotY, rotate: rotate });
            stage.addToStage(bottomOrange, { x: pos.x - 4, y: pos.y + robot.jumpCount*2.5})
            stage.addToStage(bottomYellow, { x: pos.x - 6, y: pos.y - 25 + robot.jumpCount*2.5})
            stage.addToStage(bottomGreen, { x: pos.x - 8, y: pos.y - 50 + robot.jumpCount*2.5})

            drawLeg(stage, leg1, pos.x - 40, pos.y + 50, 1, false, robot.jumpCount, walkCount, walkPhase, false)
            drawLeg(stage, leg2, pos.x - 25, pos.y + 55, 1, false, robot.jumpCount, walkCount, walkPhase, true)
            drawLeg(stage, leg1, pos.x - 10, pos.y + 60, 1, false, robot.jumpCount, walkCount, walkPhase, false)
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

        return robot;
    };

    return Robot;
});

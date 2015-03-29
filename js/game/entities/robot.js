define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity'),
        Howl = require('howler').Howl;

    require('facadejs-Box2D-plugin');

    var ui = require('./ui');
    var splashes = require('./splashes');

    var blendSFX = new Howl({ urls: ['../../sfx/blend_03.mp3']});

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

        robot.fruits = [];
        robot.score = 0;

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

        robot.addFruit = function(fruitType) {
            if (robot.fruits.length < 3) {
                blendSFX.play();
                return robot.fruits.push(fruitType);
            }
            return false;
        }

        robot.flushFruits = function (leaveSpill) {
            if (leaveSpill && robot.fruits.length) {
                splashes.addSplash(robot.fObject.getOption('x'), robot.fruits);
            }
            robot.fruits = [];
        };

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

        robot.imgShadow = new Facade.Image('blender_images/blender_shadow.png', { anchor: 'center' });

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

        // blended fruits in blender
        bottomRed = new Facade.Image( 'blender_images/fruit_1_blended1.png', {anchor: 'center'});
        bottomGreen = new Facade.Image( 'blender_images/fruit_2_blended1.png', {anchor: 'center'});
        bottomOrange = new Facade.Image( 'blender_images/fruit_3_blended1.png', {anchor: 'center'});
        bottomYellow = new Facade.Image( 'blender_images/fruit_4_blended1.png', {anchor: 'center'});
        bottomBlue = new Facade.Image( 'blender_images/fruit_5_blended1.png', {anchor: 'center'});

        fruitHighlight = new Facade.Image( 'blender_images/blender_highlight.png', {anchor: 'center'});

        function drawLeg (stage, leg, x, y, multi, backLeg, jumpCount, walkCount, walkPhase, middle) {
            leg.x = x
            leg.y = y

            // middle leg on opposite step
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
                stage.addToStage(leg.bottom, { x: cX, y: cY, rotate: cRotate});
                stage.addToStage(leg.legJoint, { x: dX, y: dY});
                stage.addToStage(leg.top, { x: bX, y: bY, rotate: bRotate});
                stage.addToStage(leg.bodyJoint, { x: aX , y: aY});
            } else {
                stage.addToStage(leg.bodyJoint, { x: aX , y: aY});
                stage.addToStage(leg.top, { x: bX, y: bY, rotate: bRotate});
                stage.addToStage(leg.bottom, { x: cX, y: cY, rotate: cRotate});
                stage.addToStage(leg.legJoint, { x: dX, y: dY});
            }
        }

        function getSmoothie(fruitName) {
            if (fruitName == "strawberry") {
                return bottomRed;
            } else if (fruitName == "apple") {
                return bottomGreen;
            } else if (fruitName == "orange") {
                return bottomOrange;
            } else if (fruitName == "banana") {
                return bottomYellow;
            } else if (fruitName == "blueberry") {
                return bottomBlue
            }
        }

        robot.draw = function (stage, shadowY) {

            var pos = this.getPosition(),
            rotate = this.body.getOption('rotate');

            pos.y = pos.y - 45

            var robotY = pos.y
            robotY = robotY + (robot.jumpCount*2.5)

            var walkCount = robot.walkCount
            var walkPhase = robot.walkPhase

            if (robot.collidingFruits.length > 0 && robot.fruits.length < 3) {
                stage.addToStage(fruitHighlight, { x: pos.x - 5, y: robotY, rotate: rotate });
            }

            // shadow
            stage.addToStage(this.imgShadow, { x: pos.x, y: shadowY, scale: 1 - (shadowY - pos.y) / shadowY * 0.7 });

            // back
            drawLeg(stage, leg1, pos.x + 10, pos.y + 45, -1, true, robot.jumpCount, walkCount, walkPhase, false)
            drawLeg(stage, leg2, pos.x + 25, pos.y + 50, -1, true, robot.jumpCount, walkCount, walkPhase, true)
            drawLeg(stage, leg1, pos.x + 40, pos.y + 55, -1, true, robot.jumpCount, walkCount, walkPhase, false)

            stage.addToStage(robot.img, { x: pos.x - 5, y: robotY, rotate: rotate });

            if (robot.fruits[0]) {
                stage.addToStage(getSmoothie(robot.fruits[0]), { x: pos.x - 4, y: pos.y + robot.jumpCount*2.5})
            }

            if (robot.fruits[1]) {
                stage.addToStage(getSmoothie(robot.fruits[1]), { x: pos.x - 6, y: pos.y - 25 + robot.jumpCount*2.5})
            }

            if (robot.fruits[2]) {
                stage.addToStage(getSmoothie(robot.fruits[2]), { x: pos.x - 8, y: pos.y - 50 + robot.jumpCount*2.5})
            }

            drawLeg(stage, leg1, pos.x - 40, pos.y + 50, 1, false, robot.jumpCount, walkCount, walkPhase, false)
            drawLeg(stage, leg2, pos.x - 25, pos.y + 55, 1, false, robot.jumpCount, walkCount, walkPhase, true)
            drawLeg(stage, leg1, pos.x - 10, pos.y + 60, 1, false, robot.jumpCount, walkCount, walkPhase, false)

        };

        // returns true if order was delivered
        robot.deliverOrder = function(orders) {

            var points = orders.checkOrders(robot.fruits);
            if (points !== -1) {
                // order matched and delivered
                robot.score += points;
                ui.entities.score.setText(ui.entities.score.value.replace(/[0-9]+/, robot.score));
                robot.flushFruits();
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

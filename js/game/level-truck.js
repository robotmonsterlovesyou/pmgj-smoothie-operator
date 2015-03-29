define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    require('facadejs-Box2D-plugin');

    var game = require('./game');

    var FruitEntity = require('./entities/fruit');
    var TruckEntity = require('./entities/truck');
    var RobotEntity = require('./entities/robot');
    var PersonEntity = require('./entities/person');

    var OrderManager = require('./orderManager');

    var state = new Plastick.State('level');

    var controller = require('./controller')(state);

    var world = new Facade.Entity().Box2D('createWorld', { canvas: game.stage.canvas, gravity: [ 0, 30 ] });

    var truck = TruckEntity(world);

    var person1 = PersonEntity(0, { x: '+=' + 100 });
    var person2 = PersonEntity(1, { x: '+=' + 360 });
    var person3 = PersonEntity(2, { x: '+=' + 620 });

    var startingTruckPlatformPos = truck.entities.platform.getOption('y');

    var bumpTick = truck.bump();

    var CATEGORY_ROBOT = 0x0001;  // 0000000000000001 in binary
    var CATEGORY_FRUIT = 0x0002; // 0000000000000010 in binary
    var CATEGORY_WALLS = 0x0004; // 0000000000000100 in binary
    var CATEGORY_STUBS = 0x0008; // 0000000000000100 in binary
    var MASK_ROBOT = CATEGORY_WALLS | CATEGORY_ROBOT; // or ~CATEGORY_PLAYER
    var MASK_FRUIT = CATEGORY_WALLS | CATEGORY_FRUIT; // or ~CATEGORY_MONSTER
    var MASK_WALLS = CATEGORY_ROBOT | CATEGORY_FRUIT | CATEGORY_WALLS;
    var MASK_STUBS = CATEGORY_WALLS;

    function addWallFiltering(wall) {
        wall._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_WALLS
        wall._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_WALLS
    }

    function addStubFiltering(wall) {
        wall._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_WALLS
        wall._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_WALLS
    }

    addWallFiltering(truck.entities.ceiling)
    addWallFiltering(truck.entities.floor)
    addWallFiltering(truck.entities.wallLeft)
    addWallFiltering(truck.entities.wallRight)
    addWallFiltering(truck.entities.platform)
    addStubFiltering(truck.entities.platformBufferLeft)
    addStubFiltering(truck.entities.platformBufferRight)

    var fruitTypes = ['apple', 'orange', 'banana', 'strawberry', 'blueberry'];
    var fruits = [];

    fruits.push(FruitEntity(world, '', { x: 200, y: 130 }));
    fruits.push(FruitEntity(world, '', { x: 300, y: 100 }));
    fruits.push(FruitEntity(world, '', { x: 400, y: 120 }));
    fruits.push(FruitEntity(world, '', { x: 500, y: 80 }));
    fruits.push(FruitEntity(world, '', { x: 600, y: 80 }));
    fruits.push(FruitEntity(world, '', { x: 700, y: 100 }));
    fruits.push(FruitEntity(world, '', { x: 800, y: 100 }));

    fruits.forEach(function(fruit) {
        fruit.body._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_FRUIT
        fruit.body._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_FRUIT
    });

    var player1 = new RobotEntity(world, {x: 500, y:100});
    player1.body._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_ROBOT
    player1.body._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_ROBOT

    var orders = new OrderManager();
    orders.createOrder();
    orders.createOrder();

    state.update(function () {

        var e;

        player1.checkFruits(fruits);
        player1.update();

        if (!(game.currentTick % bumpTick)) {

            bumpTick = truck.bump();

        }

        if (!(game.currentTick % 100)) {

            var velocity = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

            fruits.forEach(function (fruit) {

                fruit.setVelocity(fruit.getVelocity().x + velocity, fruit.getVelocity().y);

            });

        }

        player1.resetWalking()

        if (controller.queue.length) {

             while (controller.queue.length) {

                e = controller.queue.shift();

                if (e.type === 'press' && e.button === 'button_1') {
                    player1.startJump()

                } else if (e.type === 'release' && e.button === 'button_1') {
                    player1.finishJump()

                } else if (e.type === 'press' && e.button === 'button_3') {

                    player1.collidingFruits.forEach(function (fruit) {

                        fruit.body.Box2D('destroyObject');

                        fruits.splice(fruits.indexOf(fruit), 1);

                    });

                } else if (e.type === 'hold' && e.button === 'd_pad_left') {

                    player1.setVelocity(-10, null);
                    player1.walkLeft()

                } else if (e.type === 'hold' && e.button === 'd_pad_right') {

                    player1.setVelocity(10, null);
                    player1.walkRight()

                } else if (e.type === 'hold' && e.button === 'stick_axis_left') {

                    if (e.value[0] < -0.5) {

                        player1.setVelocity(-10, null);

                    } else if (e.value[0] > 0.5) {

                        player1.setVelocity(10, null);

                    }

                }

             }

        }

    });

    state.draw(function () {

        world.Box2D('step');

        // world.Box2D('drawDebug');

        var platformY = truck.entities.platform.getOption('y');

        game.stage.clear();

        game.stage.addToStage(person1.entities.face, { y: '-=' + (startingTruckPlatformPos - platformY) });
        game.stage.addToStage(person3.entities.face, { y: '-=' + (startingTruckPlatformPos - platformY) });
        game.stage.addToStage(person2.entities.face, { y: '-=' + (startingTruckPlatformPos - platformY) });

        game.stage.addToStage(truck.entities.background, {
            y: '-=' + (startingTruckPlatformPos - platformY)
        });

        game.stage.addToStage(person1.entities.arms, { y: '-=' + (startingTruckPlatformPos - platformY) });
        game.stage.addToStage(person3.entities.arms, { y: '-=' + (startingTruckPlatformPos - platformY) });
        game.stage.addToStage(person2.entities.arms, { y: '-=' + (startingTruckPlatformPos - platformY) });

        orders.draw(game.stage, platformY - startingTruckPlatformPos);

        fruits.map(function (fruit) {
            fruit.draw(game.stage, platformY);
        });
        player1.draw(game.stage, platformY);

    });

    return state;

});

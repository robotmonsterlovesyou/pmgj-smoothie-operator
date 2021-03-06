define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick'),
        Howl = require('howler').Howl;

    require('facadejs-Box2D-plugin');

    var game = require('./game');
    var pause = require('./pause');
    var endgame = require('./endgame');

    var FruitEntity = require('./entities/fruit');
    var TruckEntity = require('./entities/truck');
    var RobotEntity = require('./entities/robot');

    var OrderManager = require('./orderManager');

    var ui = require('./entities/ui');
    var splashes = require('./entities/splashes');

    var state = new Plastick.State('level');

    var controller = require('./controller')(state);

    var world = new Facade.Entity().Box2D('createWorld', { canvas: game.stage.canvas, gravity: [ 0, 30 ] });

    var truck = TruckEntity(world);
    var RESPAWN_RAMP = 0;

    var startingTruckPlatformPos = truck.entities.platform.getOption('y');

    var bumpTick = truck.bump();

    var backgroundSFX = new Howl({ urls: ['./sfx/theme.ogg', './sfx/theme.mp3'], volume: 1.0, loop: true });
    var ambienceSFX = new Howl({ urls: ['./sfx/ambience.ogg', './sfx/ambience.mp3'], volume: 1.0, loop: true });

    var CATEGORY_ROBOT = 0x0001; // 0000000000000001 in binary
    var CATEGORY_FRUIT = 0x0002; // 0000000000000010 in binary
    var CATEGORY_WALLS = 0x0004; // 0000000000000100 in binary
    var CATEGORY_STUBS = 0x0008; // 0000000000001000 in binary
    var MASK_ROBOT = CATEGORY_WALLS | CATEGORY_ROBOT;
    var MASK_FRUIT = CATEGORY_WALLS | CATEGORY_FRUIT;
    var MASK_WALLS = CATEGORY_ROBOT | CATEGORY_FRUIT | CATEGORY_WALLS | CATEGORY_STUBS;
    var MASK_STUBS = CATEGORY_WALLS | CATEGORY_STUBS;

    var MAX_LIVES = 3;

    window.MAX_FRUIT = 7;

    function addWallFiltering(wall) {
        wall._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_WALLS;
        wall._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_WALLS;
    }

    function addStubFiltering(wall) {
        wall._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_STUBS;
        wall._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_STUBS;
    }

    function createFruit(fruitType) {

        var fruit = new FruitEntity(world, fruitType, {
            x: Math.random() * (game.stage.width() - 100) + 50,
            y: 50
        });
        fruit.setVelocity(Math.random() * 6 - 3, Math.random() * 2 - 1);
        fruit.body._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_FRUIT;
        fruit.body._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_FRUIT;
        fruits.push(fruit);
    }

    addWallFiltering(truck.entities.ceiling);
    addWallFiltering(truck.entities.floor);
    addWallFiltering(truck.entities.wallLeft);
    addWallFiltering(truck.entities.wallRight);
    addWallFiltering(truck.entities.platform);
    addStubFiltering(truck.entities.platformBufferLeft);
    addStubFiltering(truck.entities.platformBufferRight);

    var fruitTypes = ['apple', 'orange', 'banana', 'strawberry', 'blueberry'];
    var fruits = [];

    var player1 = new RobotEntity(world, {x: 500, y: 465});
    player1.body._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_ROBOT;
    player1.body._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_ROBOT;

    var orders = new OrderManager();

    state.registerListener(document, 'keydown', function (e) {

        if (!e.metaKey) {

            e.preventDefault();

        }

    });

    state.init(function (game) {

        backgroundSFX.fadeIn(0.5, 2000);
        ambienceSFX.fadeIn(1.0, 2000);

        controller.resume();
    });

    state.update(function (game) {

        var e;

        ui.entities.time.setText(ui.entities.time.value.replace(/[0-9]+/,
            (Math.floor((game.gameTime() - game.data.pauseTime) / 1000))
        ));

        /*
        truck.entities.clouds.forEach(function (cloud) {
            cloud.setOptions({ x: '-=5' });
            if (cloud.getOption('x') < -game.stage.width()) {
                cloud.setOptions({ x: game.stage.width() });
            }
        });
        */

        player1.checkFruits(fruits);
        player1.update();

        if (player1.failures >= MAX_LIVES) {
            game.pushState(endgame);
        }

        if (orders.checkExpired()) {
            player1.failures += 1;
            ui.setLivesUsed(player1.failures);
        }

        orders.runCleanup();

        if (!(game.currentTick % bumpTick)) {

            bumpTick = truck.bump();

        }

        // create a new order occasioanlly if there is room
        if (!((game.currentTick - 180) % (600 - RESPAWN_RAMP))) orders.createOrder();

        // create a fruit occasionally of there are less than MAX_FRUIT
        // make sure new fruit helps make orderes possible
        if (!(game.currentTick % 60) && fruits.length < window.MAX_FRUIT) {

            var neededFruits = orders.getNeededFruits(fruits);
            if(neededFruits.length > 0) createFruit(neededFruits[Math.floor(Math.random() * neededFruits.length)]);
            else createFruit();

        }

        // jostle truck left/right occasionally (fruits move, camera doesn't)
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

                if (e.type === 'release' && e.button === 'start') {

                    controller.queue = [];
                    game.pushState(pause);
                    return;

                } else if (e.type === 'press' && e.button === 'button_1') {
                    player1.startJump()

                } else if (e.type === 'release' && e.button === 'button_1') {
                    player1.finishJump()

                } else if (e.type === 'press' && e.button === 'button_2') {

                    player1.flushFruits(true);

                } else if (e.type === 'press' && e.button === 'button_3') {

                    player1.collidingFruits.forEach(function (fruit) {

                        if (player1.addFruit(fruit.type)) {

                            fruit.body.Box2D('destroyObject');

                            fruits.splice(fruits.indexOf(fruit), 1);

                        }
                    });

                    // deliver an order
                    if (player1.deliverOrder(orders) && RESPAWN_RAMP < 380) RESPAWN_RAMP += 20;

                } else if (e.type === 'hold' && e.button === 'd_pad_left') {

                    player1.setVelocity(-10, null);
                    player1.walkLeft()

                } else if (e.type === 'hold' && e.button === 'd_pad_right') {

                    player1.setVelocity(10, null);
                    player1.walkRight()

                } else if (e.type === 'hold' && e.button === 'stick_axis_left') {

                    if (e.value[0] < -0.5) {
                        player1.setVelocity(-10, null);
                        player1.walkLeft()


                    } else if (e.value[0] > 0.5) {
                        player1.setVelocity(10, null);
                        player1.walkRight()

                    }

                }

             }

        }

    });

    state.draw(function (game) {

        world.Box2D('step');

        // world.Box2D('drawDebug');

        var platformY = truck.entities.platform.getOption('y');

        game.stage.clear();

        game.stage.addToStage(truck.entities.clouds);

        orders.beforeTruckDraw(game.stage, platformY - startingTruckPlatformPos);

        game.stage.addToStage(truck.entities.background, {
            y: '-=' + (startingTruckPlatformPos - platformY)
        });

        game.stage.addToStage(splashes.entities.splashes, { y: '-=' + (startingTruckPlatformPos - platformY)});

        orders.afterTruckDraw(game.stage, platformY - startingTruckPlatformPos);

        fruits.map(function (fruit) {
            fruit.draw(game.stage, platformY);
        });

        player1.draw(game.stage, platformY);

        game.stage.addToStage(ui.entities.group);

    });

    state.pause(function (game) {

        controller.pause();

        ui.setPausedState();

    });

    return state;

});

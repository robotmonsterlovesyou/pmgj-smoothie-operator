define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    require('facadejs-Box2D-plugin');

    var game = require('./game');

    var FruitEntity = require('./entities/fruit');
    var TruckEntity = require('./entities/truck');

    var state = new Plastick.State('level');

    var controller = require('./controller')(state);

    var world = new Facade.Entity().Box2D('createWorld', { canvas: game.stage.canvas, gravity: [ 0, 20 ] });

    var truck = TruckEntity(world, { x: 62, y: 62 });

    var bumpTick = truck.bump();

    var fruits = [];

    fruits.push(FruitEntity(world, 'apple', { x: 200, y: 130 }));
    fruits.push(FruitEntity(world, 'orange', { x: 300, y: 100 }));
    fruits.push(FruitEntity(world, 'banana', { x: 400, y: 120 }));
    fruits.push(FruitEntity(world, 'banana', { x: 500, y: 80 }));
    fruits.push(FruitEntity(world, 'strawberry', { x: 600, y: 80 }));
    fruits.push(FruitEntity(world, 'blueberry', { x: 700, y: 100 }));
    fruits.push(FruitEntity(world, 'apple', { x: 800, y: 100 }));

    state.update(function () {

        if (!(game.currentTick % bumpTick)) {

            bumpTick = truck.bump();

        }

        if (!(game.currentTick % 100)) {

            var velocity = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

            fruits.forEach(function (fruit) {

                fruit.setVelocity(fruit.getVelocity().x + velocity, fruit.getVelocity().y);

            });

        }

    });

    state.draw(function () {

        world.Box2D('step');

        world.Box2D('drawDebug');

        // game.stage.clear();
        fruits.map(function (fruit) { fruit.draw(game.stage); });

    });

    return state;

});

define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    require('facadejs-Box2D-plugin');

    var game = require('./game');

    var fruitEntity = require('./entities/fruit');

    var state = new Plastick.State('level');

    var controller = require('./controller')(state);

    var world = new Facade.Entity().Box2D('createWorld', { canvas: game.stage.canvas, gravity: [ 0, 20 ] });

    var platform = new Facade.Rect({ x: 0, y: 300, width: 800, height: 25, fillStyle: 'blue' });

    platform.Box2D('createObject', world, { type: 'fixed' });

    var fruits = [];

    fruits.push(fruitEntity(world, { x: 100, y: 50 }));
    fruits.push(fruitEntity(world, { x: 200, y: 0 }));
    fruits.push(fruitEntity(world, { x: 300, y: 50 }));
    fruits.push(fruitEntity(world, { x: 400, y: 75 }));
    fruits.push(fruitEntity(world, { x: 500, y: -50 }));
    fruits.push(fruitEntity(world, { x: 600, y: 200 }));
    fruits.push(fruitEntity(world, { x: 700, y: 0 }));

    state.update(function () {

        // world.Box2D('step');

    });

    state.draw(function () {

        world.Box2D('step');

        game.stage.clear();
        game.stage.addToStage(platform);
        game.stage.addToStage(fruits);

        world.Box2D('drawDebug');

    });

    return state;

});

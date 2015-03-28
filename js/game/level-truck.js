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

    var fruit = FruitEntity(world, { x: 200, y: 130 });
    var fruit = FruitEntity(world, { x: 300, y: 100 });
    var fruit = FruitEntity(world, { x: 400, y: 120 });
    var fruit = FruitEntity(world, { x: 500, y: 80 });
    var fruit = FruitEntity(world, { x: 600, y: 80 });

    state.update(function () {

        if (!(game.currentTick % bumpTick)) {

            bumpTick = truck.bump();

        }

    });

    state.draw(function () {

        world.Box2D('step');

        game.stage.clear();
        game.stage.addToStage(truck.entities);

        world.Box2D('drawDebug');

    });

    return state;

});

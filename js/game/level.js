define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    require('facadejs-Box2D-plugin');

    var game = require('./game');

    var FruitEntity = require('./entities/fruit');

    var state = new Plastick.State('level');

    var controller = require('./controller')(state);

    var world = new Facade.Entity().Box2D('createWorld', { canvas: game.stage.canvas, gravity: [ 0, 20 ] });

    var platform = new Facade.Rect({ x: 0, y: 300, width: 800, height: 25, fillStyle: 'blue' });

    platform.Box2D('createObject', world, { type: 'fixed' });

    var fruits = [];

    for ( var i = 0; i < 7; i += 1) {
        fruits.push( new FruitEntity(world, {
            x: 100 * (i + 1),
            y: Math.random() * 250 - 50
        }));
    }

    state.update(function () {

        // world.Box2D('step');
    });

    state.draw(function () {

        world.Box2D('step');

        game.stage.clear();
        game.stage.addToStage(platform);
        for (var fruit = 0; fruit < fruits.length; fruit += 1) fruits[fruit].draw(game.stage);

        //world.Box2D('drawDebug');

    });

    return state;

});

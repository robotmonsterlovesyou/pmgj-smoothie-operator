define(function (require) {

    var Facade = require('facade'),
        Plastick = require('plastick');

    require('facadejs-Box2D-plugin');

    var game = require('./game');

    var FruitEntity = require('./entities/fruit');
    var RobotEntity = require('./entities/robot');

    var state = new Plastick.State('level');

    var controller = require('./controller')(state);

    var world = new Facade.Entity().Box2D('createWorld', { canvas: game.stage.canvas, gravity: [ 0, 20 ] });

    var platform = new Facade.Rect({ x: 0, y: 500, width: 1024, height: 25, fillStyle: 'blue' });

    platform.Box2D('createObject', world, { type: 'fixed' });

    var CATEGORY_ROBOT = 0x0001;  // 0000000000000001 in binary
    var CATEGORY_FRUIT = 0x0002; // 0000000000000010 in binary
    var CATEGORY_WALLS = 0x0004; // 0000000000000100 in binary

    var MASK_ROBOT = CATEGORY_WALLS | CATEGORY_ROBOT; // or ~CATEGORY_PLAYER
    var MASK_FRUIT = CATEGORY_WALLS | CATEGORY_FRUIT; // or ~CATEGORY_MONSTER
    var MASK_WALLS = CATEGORY_ROBOT | CATEGORY_FRUIT;

    platform._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_WALLS
    platform._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_WALLS

    var fruits = [];

    for ( var i = 0; i < 2; i += 1) {
        var fruit = new FruitEntity(world, 'apple', {
            x: 500 + (i + 1),
            y: Math.random() * 100
        })

        fruits.push(fruit);

        fruit.body._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_FRUIT
        fruit.body._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_FRUIT
    }

    var player1 = new RobotEntity(world, {x: 500, y:100});
    player1.body._box2d.entity.GetFixtureList().m_filter.categoryBits = CATEGORY_ROBOT
    player1.body._box2d.entity.GetFixtureList().m_filter.maskBits = MASK_ROBOT

    console.log(fruits[0].objectType)
    player1.body.Box2D('setCallback', 'PreSolve', function (self, other) {

        console.log(self.parent)
        if (other.type == "fruit") {
            console.log("beep")
        }

        if (self.type =="fruit") {
            console.log("beep2")
        }
        // if (a && a.Box2D) {
        //     console.log("beep")
        // }

    });

    player1.body


    state.update(function () {

        // world.Box2D('step');
    });

    state.draw(function () {

        world.Box2D('step');

        game.stage.clear();
        game.stage.addToStage(platform);
        for (var fruit = 0; fruit < fruits.length; fruit += 1) fruits[fruit].draw(game.stage);

            player1.draw(game.stage);
        //world.Box2D('drawDebug');

    });

    return state;

});

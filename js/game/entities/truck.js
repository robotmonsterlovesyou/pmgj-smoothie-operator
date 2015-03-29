define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    var game = require('../game');

    function Truck (world, options) {

        var background = new Facade.Image('./blender_images/truck_interior.png');
        var clouds = new Facade.Image('./blender_images/clouds.png');

        var ceiling = new Facade.Rect({ x: 0, y: -25, width: game.stage.width(), height: 25 });
        var floor = new Facade.Rect({ x: 0, y: game.stage.height(), width: game.stage.width(), height: 25 });
        var wallLeft = new Facade.Rect({ x: -25, y: 0, width: 25, height: game.stage.height() });
        var wallRight = new Facade.Rect({ x: game.stage.width(), y: 0, width: 25, height: game.stage.height() });
        var platform = new Facade.Rect({ x: 5, y: game.stage.height() - 50, width: game.stage.width() - 10, height: 50 });
        var platformBufferLeft = new Facade.Rect({ x: -25, y: game.stage.height() - 100, width: 50, height: 25 });
        var platformBufferRight = new Facade.Rect({ x: game.stage.width() - 25, y: game.stage.height() - 100, width: 50, height: 25 });

        function position (x, y) {

            if (!x) { x = 0; }
            if (!y) { y = 0; }

            ceiling.setOptions({ x: '+=' + x, y: '+=' + y });
            floor.setOptions({ x: '+=' + x, y: '+=' + y });
            wallLeft.setOptions({ x: '+=' + x, y: '+=' + y });
            wallRight.setOptions({ x: '+=' + x, y: '+=' + y });
            platform.setOptions({ x: '+=' + x, y: '+=' + y });
            platformBufferLeft.setOptions({ x: '+=' + x, y: '+=' + y });
            platformBufferRight.setOptions({ x: '+=' + x, y: '+=' + y });

        }

        if (options) {

            position(options.x, options.y);

        }

        ceiling.Box2D('createObject', world, { type: 'fixed' });
        floor.Box2D('createObject', world, { type: 'fixed' });
        wallLeft.Box2D('createObject', world, { type: 'fixed' });
        wallRight.Box2D('createObject', world, { type: 'fixed' });
        platform.Box2D('createObject', world, { type: 'dynamic' });
        platformBufferLeft.Box2D('createObject', world, { type: 'fixed' });
        platformBufferRight.Box2D('createObject', world, { type: 'fixed' });

        return {
            entities: {
                'ceiling': ceiling,
                'floor': floor,
                'wallLeft': wallLeft,
                'wallRight': wallRight,
                'platform': platform,
                'platformBufferLeft': platformBufferLeft,
                'platformBufferRight': platformBufferRight,
                'background': background,
                'clouds': clouds
            },
            position: position,
            bump: function () {

                var nextTick = Math.floor(Math.random() * 30) + 60;

                platform._box2d.entity.ApplyImpulse(
                    new Box2D.Common.Math.b2Vec2(0, -500),
                    platform._box2d.entity.GetWorldCenter()
                );

                return nextTick;

            }
        };

    };

    return Truck;

});

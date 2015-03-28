define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    function Truck (world, options) {

        var ceiling = new Facade.Rect({ x: 0, y: 0, width: 900, height: 25 });
        var floor = new Facade.Rect({ x: 0, y: 425, width: 900, height: 25 });
        var wallLeft = new Facade.Rect({ x: 0, y: 0, width: 25, height: 450 });
        var wallRight = new Facade.Rect({ x: 875, y: 0, width: 25, height: 450 });
        var platform = new Facade.Rect({ x: 30, y: 375, width: 840, height: 50 });
        var platformBufferLeft = new Facade.Rect({ x: 0, y: 325, width: 50, height: 25 });
        var platformBufferRight = new Facade.Rect({ x: 850, y: 325, width: 50, height: 25 });

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

        position(options.x, options.y);

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
                'platformBufferRight': platformBufferRight
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

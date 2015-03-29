define(function (require) {

    var Facade = require('facade');

    var splashes = new Facade.Group();

    var images = {
        strawberry: './blender_images/fruit_1_splat.png',
        apple: './blender_images/fruit_2_splat.png',
        orange: './blender_images/fruit_3_splat.png',
        banana: './blender_images/fruit_4_splat.png',
        blueberry: './blender_images/fruit_5_splat.png'
    };

    return {
        entities: {
            splashes: splashes,
        },
        addSplash: function (x, fruits) {

            var y = 520 + (Math.random() * 24 - 12);

            splashes._objects = splashes._objects.slice(-99);

            fruits.forEach(function (fruit) {

                splashes.addToGroup(new Facade.Image(images[fruit], { x: x, y: y, anchor: 'center' }));

            });

        }
    };

});

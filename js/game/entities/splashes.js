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
        addSplash: function (position, fruits) {

            splashes._objects = splashes._objects.slice(-24);

            splashes.addToGroup(new Facade.Image(images[fruits[0]], { x: position, y: 520 + (Math.random() * 24 - 12), anchor: 'center' }));

        }
    };

});

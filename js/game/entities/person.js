define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    var game = require('../game');

    var data = [
        {
            face: {
                image: './blender_images/sprite_face_1.png',
                options: { x: 80, y: 70, width: 155, frames: [0, 1] }
            },
            arms: {
                image: './blender_images/people_arms2.png',
                options: { x: 0, y: 170 }
            }
        },
        {
            face: {
                image: './blender_images/sprite_face_2.png',
                options: { x: 80, y: 70, width: 118, frames: [0, 1] }
            },
            arms: {
                image: './blender_images/people_arms1.png',
                options: { x: 0, y: 170 }
            }
        },
        {
            face: {
                image: './blender_images/sprite_face_3.png',
                options: { x: 80, y: 90, width: 123, frames: [0, 1] }
            },
            arms: {
                image: './blender_images/people_arms2.png',
                options: { x: 0, y: 170 }
            }
        }
    ]

    function Person (id, options) {

        var face = new Facade.Image(data[id].face.image, data[id].face.options),
            arms = new Facade.Image(data[id].arms.image, data[id].arms.options);

        face.setOptions(options);
        arms.setOptions(options);

        face.play();

        return {
            entities: {
                face: face,
                arms: arms
            }
        };

    }

    return Person;

});

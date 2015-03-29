define(function (require) {

    var Facade = require('facade'),
        Entity = require('./entity');

    var game = require('../game');

    var data = [
        {
            face: {
                image: './blender_images/sprite_face_1.png',
                options: { x: 60, y: 70, width: 155, frames: [0, 1] }
            },
            arms: {
                image: './blender_images/people_arms2.png',
                options: { x: 0, y: 182 }
            },
            victory: {
                image: './blender_images/people_arms2_victory.png',
                options: { x: -120, y: -57 }
            }
        },
        {
            face: {
                image: './blender_images/sprite_face_2.png',
                options: { x: 60, y: 70, width: 118, frames: [0, 1] }
            },
            arms: {
                image: './blender_images/people_arms1.png',
                options: { x: 0, y: 182 }
            },
            victory: {
                image: './blender_images/people_arms1_victory.png',
                options: { x: -130, y: -57 }
            }
        },
        {
            face: {
                image: './blender_images/sprite_face_3.png',
                options: { x: 60, y: 90, width: 123, frames: [0, 1] }
            },
            arms: {
                image: './blender_images/people_arms2.png',
                options: { x: 0, y: 182 }
            },
            victory: {
                image: './blender_images/people_arms2_victory.png',
                options: { x: -130, y: -57 }
            }
        }
    ]

    function Person (id, options) {

        var face = new Facade.Image(data[id].face.image, data[id].face.options),
            arms = new Facade.Image(data[id].arms.image, data[id].arms.options),
            victory = new Facade.Image(data[id].victory.image, data[id].victory.options),
            timer = new Facade.Text('60', {
                x: 95,
                y: 20,
                fontFamily: 'Passion One',
                fontSize: 35,
                fillStyle: '#f33',
                textAlignment: 'center'
            });

        face.setOptions(options);
        arms.setOptions(options);
        victory.setOptions(options);
        timer.setOptions(options);

        face.play();

        var state = {
            faceCount: 200,
            satisfied: false
        }

        return {
            state: state,
            entities: {
                face: face,
                arms: arms,
                victory: victory,
                timer: timer
            },

            drawFace: function(stage, y) {
                var newY = y

                if (state.satisfied == null || state.satisfied == false) {
                    state.faceCount = Math.max(0, state.faceCount - 8)
                    newY = (y + state.faceCount)
                } else {
                    // state.faceCount = Math.max(0, state.faceCount - 2)
                    // newY = (y + (200 - state.faceCount))
                }

                stage.addToStage(face, {y: "+=" + newY});
            },

            setSatisfied: function() {
                state.satisfied = true;
                state.faceCount = 200;
            }
        };

    }

    return Person;

});

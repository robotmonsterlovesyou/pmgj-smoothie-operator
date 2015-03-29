define(function (require) {

    var Gamepad = require('gamepad');

    return function (state) {

        var controller = new Gamepad(),
            buttons = Object.keys(controller._keyMapping.gamepad);

        controller.setGlobalThreshold(0.1);

        buttons = buttons.concat(Object.keys(controller._keyMapping.axes));

        // To prevent bug with controller shoulder buttons.
        buttons.splice(buttons.indexOf('shoulder_bottom_left'), 1);
        buttons.splice(buttons.indexOf('shoulder_bottom_right'), 1);
        // To prevent bug with controller shoulder buttons.

        controller.queue = [];

        controller.setCustomMapping('keyboard', {
            'button_1': 32,
            'button_3': 13,
            'start': 27,
            'd_pad_up': [38, 87],
            'd_pad_down': [40, 83],
            'd_pad_left': [37, 65],
            'd_pad_right': [39, 68]
        });

        controller.on('hold', buttons, function (e) {

            controller.queue.push(e);

        });

        controller.on('press', buttons, function (e) {

            controller.queue.push(e);

        });

        controller.on('release', buttons, function (e) {

            controller.queue.push(e);

        });

        controller.pause();

        state.init(function () {

            controller.resume();

        });

        state.pause(function () {

            controller.pause();

        });

        state.resume(function () {

            controller.resume();

        });

        state.cleanup(function () {

            controller.destroy();

        });

        return controller;

    };

});

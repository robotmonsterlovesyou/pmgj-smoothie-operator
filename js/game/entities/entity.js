/*globals Facade, define, window*/

define(function (require) {

    'use strict';

    var Facade = require('facade');

    require('facadejs-Box2D-plugin');

    var nextId = 0;

    // args are optional
    function Entity(world, fObject, fOptions, bOptions) {

        this.id = nextId;
        this.fOptions = fOptions;
        this.bOptions = bOptions;
        nextId += 1;

        if (fObject) {
            this.body = fObject;
        } else {
            this.body = new Facade.Rect({
                x: 0,
                y: 0,
                width: 30,
                height: 30,
                fillStyle: 'blue'
            });
        }
        this.body.setOptions(fOptions);

        if (bOptions) {
            this.body.Box2D('createObject', world, bOptions);
        } else {
            this.body.Box2D('createObject', world, {
                type: 'fixed',
                rotate: true,
                density: 1.0,
                restitution: 1.0
            });
        }
    };

    // returns { x, y }
    Entity.prototype.getPosition = function () {

        return this.Box2D('getPosition');
    };

    // returns { x, y }
    Entity.prototype.getVelocity = function () {

        return this.Box2D('getVelocity');
    };

    Entity.prototype.setPosition = function (x, y) {

        return this.Box2D('setPosition', x, y);
    };

    Entity.prototype.setVelocity = function (x, y) {

        return this.Box2D('setVelocity', x, y);
    };

    // set Facade object options
    Entity.prototype.setFOptions = function (options) {

        this.fOptions = options;
        this.body.setOptions(this.fOptions);
console.log(this.body);
    };

    // WIP
    Entity.prototype.setImage = function (facadeImage) {

        this.body = new Facade.Image('images/' + imgFile + '.png');
        this.body.setOptions(fOptions);
        if (bOptions) {
            this.body.Box2D('createObject', world, options);
        } else {
            this.body.Box2D('createObject', world, {
                type: 'fixed',
                rotate: true,
                density: 1.0,
                restitution: 1.0
            });
        }
    };

    // WIP
    Entity.prototype.isWithinViewport = function (stage, viewport) {

        //return (viewport.position.x <= this.position.x + this.&& viewport.position.x ;
        return true;
    };

    Entity.prototype.draw = function (stage, viewport) {

        stage.addToStage(this.body);
        console.log('draw');
    };

    return Entity;

});

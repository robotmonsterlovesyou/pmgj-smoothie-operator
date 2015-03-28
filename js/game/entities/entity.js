/*globals Facade, define, window*/

define(function (require) {

    'use strict';

    var Facade = require('facade');

    require('facadejs-Box2D-plugin');

    var nextId = 0;

    // world = Facade.Entity() (required)
    // fObject = Facade object (optional)
    // fOptions = default Facade object options for this Entity (optional)
    // bOptions = Box2D body options (optiona)
    function Entity(world, fObject, fOptions, bOptions) {

        this.id = nextId;
        nextId += 1;

        this.world = world;
        this.fObject = fObject || new Facade.Rect({
            x: 0,
            y: 0,
            width: 30,
            height: 30,
            fillStyle: 'blue'
        });
        this.fOptions = fOptions || {};
        this.bOptions = bOptions || {
            type: 'fixed',
            restitution: 1.0
        };

        this.fObject._parent = this;

        this.reset();
    };

    // reset to default state
    Entity.prototype.reset = function () {

        this.body = this.fObject;
        this.body.setOptions(this.fOptions);
        this.body.Box2D('createObject', this.world, this.bOptions);
    };

    // returns { x, y }
    Entity.prototype.getPosition = function () {

        return this.body.Box2D('getPosition');
    };

    // returns { x, y }
    Entity.prototype.getVelocity = function () {

        return this.body.Box2D('getVelocity');
    };

    Entity.prototype.setPosition = function (x, y) {

        return this.body.Box2D('setPosition', x, y);
    };

    Entity.prototype.setVelocity = function (x, y) {

        return this.body.Box2D('setVelocity', x, y);
    };

    // set Facade object options
    Entity.prototype.setFOptions = function (options) {

        this.fOptions = options;
        this.body.setOptions(this.fOptions);
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


    Entity.prototype.draw = function (stage) {

        stage.addToStage(this.body);
    };

    return Entity;

});

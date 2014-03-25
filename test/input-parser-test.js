var assert = require('assert');
var userInput = require('../lib/user-input');

describe('#InputParser', function () {
    describe('parseInput', function () {
        it('should parse input and identify task and package', function () {
            var inputs = ['install', 'errorButton'];
            var expected = {task: 'install', packageInfo: 'errorButton', isGlobal: false};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        });
    })

    describe('parseInput', function () {
        it('should identify that given task has to be performed globally', function () {
            var inputs = ['uninstall', '-g', 'button'];
            var expected = {task: 'uninstall', packageInfo: 'button', isGlobal: true};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        })
    })

    describe('parseInput', function () {
        it('should identify package and options in any order', function () {
            var inputs = ['install', 'button', '-g'];
            var expected = {task: 'install', packageInfo: 'button', isGlobal: true};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        })
    })
})
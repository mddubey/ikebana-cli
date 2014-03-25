var assert = require('assert');
var inputParser = require('../js/input-parser');

describe('#InputParser', function () {
    describe('getUserInput', function () {
        it('should parse input', function () {
            var inputs = ['install', 'button'];
            var expected = {task: 'install', packageInfo: 'button', isGlobal: false};
            var actual = inputParser.getUserInput(inputs);

            assert.deepEqual(expected, actual);
        });
    })

    describe('getUserInput', function () {
        it('should identify that given task has to be performed globally', function () {
            var inputs = ['install', '-g', 'button'];
            var expected = {task: 'install', packageInfo: 'button', isGlobal: true};
            var actual = inputParser.getUserInput(inputs);

            assert.deepEqual(expected, actual);
        })
    })

    describe('getUserInput', function () {
        it('should identify package and options in any order', function () {
            var inputs = ['install', 'button', '-g'];
            var expected = {task: 'install', packageInfo: 'button', isGlobal: true};
            var actual = inputParser.getUserInput(inputs);

            assert.deepEqual(expected, actual);
        })
    })
})
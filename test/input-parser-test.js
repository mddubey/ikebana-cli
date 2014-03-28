var assert = require('assert');
var userInput = require('../lib/user-input');

describe('#InputParser', function () {
    describe('parseInput', function () {
        it('should parse input and identify task and package', function () {
            var inputs = ['install', 'errorButton'];
            var expected = {task: 'install', packageInfo: 'errorButton'};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        });
    })

    describe('parseInput', function () {
        it('should identify that given task has to be performed globally', function () {
            var inputs = ['uninstall', 'button'];
            var expected = {task: 'uninstall', packageInfo: 'button'};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        })
    });
});
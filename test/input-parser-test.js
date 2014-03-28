var assert = require('assert');
var mockito = require('jsmockito').JsMockito;
var installer = require('../lib/install').installer;
var mockInstaller = mockito.mock(installer);
var userInput = require('../lib/user-input').userInput;

var assert_error = function (operation, expected_error) {
    try {
        operation();
    }
    catch (err) {
        assert.equal(expected_error, err);
        return;
    }
    ;
    assert.fail('expecting exception ' + expected_error);
};

describe('InputParser', function () {
    describe('#parseInput', function () {
        it('should parse input and identify task and package', function () {
            var inputs = ['install', 'errorButton'];
            var expected = {task: 'install', packageInfo: 'errorButton'};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        });
    });

    describe('#parseInput', function () {
        it('should identify that given task and package', function () {
            var inputs = ['install', 'button'];
            var expected = {task: 'install', packageInfo: 'button'};
            var actual = userInput.parseInput(inputs);

            assert.deepEqual(expected, actual);
        })
    });

    describe('#parseInput', function () {
        it('should throw error when all arguments are not given', function () {
            var inputs = ['install'];
            var expected_error = "ikebana:- arguments are not proper \nusage: ikebana install <packageName>";
            assert_error(function () {
                userInput.parseInput(inputs);
            }, expected_error);
        })
    })

    describe('#parseInput', function () {
        it('should throw error when task name is not proper', function () {
            var inputs = ['instal', 'button'];
            var expected_error = "ikebana:- arguments are not proper \nusage: ikebana install <packageName>";
            assert_error(function () {
                userInput.parseInput(inputs);
            }, expected_error);
        })
    })

    describe('#processInput', function () {
        it('should call installer with given package', function () {
            var input = {task: 'install', packageInfo: 'toolbar'};
            userInput.installer = mockInstaller;
            userInput.processInput(input);
            mockito.verify(mockInstaller,mockito.Verifiers.once()).installPackage('toolbar');
        })
    })
});
var userInput = {};
userInput.installer = require('./install').installer;

userInput.parseInput = function (arguments) {
    if (arguments.length < 2 || arguments[0] != 'install') {
        var msg = "ikebana:- arguments are not proper \nusage: ikebana install <packageName>";
        throw msg;
    }
    var input = {};
    input.task = arguments[0];
    input.packageInfo = arguments[1];
    return input;
}

userInput.processInput = function (input) {
    if (input.task == 'install') {
        userInput.installer.install(input.packageInfo);
    }
}

exports.userInput = userInput;
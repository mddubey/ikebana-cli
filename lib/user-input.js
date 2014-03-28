var installer = require('./install');

exports.parseInput = function (arguments) {
    if (arguments.length < 2 || arguments[0] != 'install') {
        var msg = "ikebana:- arguments are not proper \nusage: ikebana install [options] <packageName>";
        throw msg;
    }
    var userInput = {};
    userInput.task = arguments[0];
    userInput.packageInfo = arguments[1];
    return userInput;
}

exports.processInput = function (userInput) {
    if (userInput.task == 'install') {
        installer.installPackage(userInput.packageInfo);
    }
}
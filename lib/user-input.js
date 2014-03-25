var installer = require('./install');

exports.parseInput = function (arguments) {
    var userInput = {};
    userInput.task = arguments[0];
    userInput.isGlobal = false;
    for (i = 1; i < arguments.length; i++) {
        if (arguments[i] == '-g') {
            userInput.isGlobal = true;
        }
        else
            userInput.packageInfo = arguments[i];
    }
    return userInput;
}

exports.processInput = function (userInput) {
    if (userInput.task == 'install') {
        installer.installPackage(userInput.packageInfo, userInput.isGlobal);
    }
}
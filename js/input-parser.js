exports.getUserInput = function (userInputs) {
    var input = {};
    input.task = userInputs[0];
    input.isGlobal = false;
    for (i = 1; i < userInputs.length; i++) {
        if (userInputs[i] == '-g') {
            input.isGlobal = true;
        }
        else
            input.packageInfo = userInputs[i];
    }
    return input;
}
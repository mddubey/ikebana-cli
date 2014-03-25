var inputParser = require('./lib/user-input');
var main = function (argv) {
    var userInput = inputParser.parseInput(argv.slice(2));
    inputParser.processInput(userInput);
}

main(process.argv);
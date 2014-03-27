var inputParser = require('./lib/user-input');
var main = function (argv) {
    try{
        var userInput = inputParser.parseInput(argv.slice(2));
        inputParser.processInput(userInput);
    }
    catch (err){
        console.log(err);
    }
}

main(process.argv);
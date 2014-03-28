var spawn = require('child_process').spawn;

var extractZip = function (zipFile) {
    var unzip = spawn('unzip', ['-q', '-o', '-d', 'ikebana_modules', zipFile]);
}

exports.extractZip = extractZip;

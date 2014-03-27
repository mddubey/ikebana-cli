var spawn = require('child_process').spawn;
var pathManager = require('./path-manager');

var extractZip = function (zipFile, isGlobal) {
    var installationPath= pathManager.getInstallationPath(isGlobal);
    var unzip = spawn('unzip', ['-q', '-o', '-d', installationPath, zipFile]);

    unzip.stderr.setEncoding('utf-8');
    unzip.stderr.on('data', function (data) {
        console.log(data);
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', function () {
            var chunk = process.stdin.read();
            if (chunk !== null) {
                unzip.stdin.write(chunk);
            }
        });
        process.stdin.on('end', function () {
            process.stdout.write('end');
        });
    });

    unzip.stderr.on('end', function () {
        process.stdin.end();
    })
}

exports.extractZip = extractZip;

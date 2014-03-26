var spawn = require('child_process').spawn;

var extractZip = function (zipFile) {
    var unzip = spawn('unzip', ['-q','-o', '-d', 'ikebana_modules', zipFile]);

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

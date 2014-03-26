var path = require('path');
var fs = require('fs');
var http = require('http');
var extractor = require('./zip-extractor');

exports.downloadPackage = function (package, cachePath) {
    fs.existsSync(cachePath) || fs.mkdirSync(cachePath);
    var packageZip = fs.createWriteStream(path.join(cachePath, package));
    var request = http.get("http://10.4.33.146:8080/" + package, function (response) {
        response.pipe(packageZip);

        extractor.extractZip(packageZip.path);
    });
}
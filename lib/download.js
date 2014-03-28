var path = require('path');
var fs = require('fs');
var http = require('http');
var extractor = require('./zip-extractor');

exports.downloadPackage = function (packageToDownload, cachePath, isGlobal) {
    fs.existsSync(cachePath) || fs.mkdirSync(cachePath);
    var packageZip = fs.createWriteStream(path.join(cachePath, packageToDownload));
    var request = http.get("http://10.4.33.146:8080/" + packageToDownload, function (response) {
        response.pipe(packageZip);
        setTimeout(function () {
            extractor.extractZip(packageZip.path, isGlobal);
        }, 1000);
    });
}
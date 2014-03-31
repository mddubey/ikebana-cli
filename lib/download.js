var path = require('path');
var fs = require('fs');
var http = require('http');
var extractor = require('./zip-extractor');

exports.downloadPackage = function (packageToDownload, cachePath) {
    fs.existsSync(cachePath) || fs.mkdirSync(cachePath);
    var packageZip = fs.createWriteStream(path.join(cachePath, packageToDownload));
    var request = http.get("http://localhost:8080/" + packageToDownload, function (response) {
        response.pipe(packageZip);
        console.log('ikebana\t\tinstall\t\tnot-cached\t\t' + packageToDownload);
        setTimeout(function () {
            extractor.extractZip(packageZip.path);
        }, 1000);
    });
}
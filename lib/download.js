var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var template = require('./template');


exports.downloadPackage = function (package) {
    var packageZip = fs.createWriteStream(package);
    var request = http.get("http://10.4.33.146:8080/" + package, function (response) {
        response.pipe(packageZip);
        extractZip(package);
    });
}

var extractZip = function (zipFile) {
    var unzipCmd = "unzip -qod ikebana_modules ZIP & rm ZIP";
    unzipCmd = template.applyTemplate(unzipCmd, {ZIP: zipFile});
    exec(unzipCmd);
}
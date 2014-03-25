var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var template = require('./template');

var start = function (packageName) {
    var latestVersion = getLatestVersion(packageName);
}

var getLatestVersion = function (packageName) {
    var onResponse = function (response) {
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            var latestPackage = JSON.parse(data)[packageName];
            downloadPackage(latestPackage['latest']);
        });
    };
    var request = http.get("http://10.4.33.146:8080/package-version.json", onResponse);
}

var downloadPackage = function (package) {
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

start("button");
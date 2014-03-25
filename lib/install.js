var downloader = require('./download');
var http = require('http');

var downloadLatestVersion = function (packageName) {
    var onResponse = function (response) {
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            var latestPackage = JSON.parse(data)[packageName];
            downloader.downloadPackage(latestPackage['latest']);
        });
    };
    var request = http.get("http://10.4.33.146:8080/package-version.json", onResponse);
}

exports.installPackage = function (packageInfo, isGlobal) {
    if (packageInfo.indexOf('@') > -1) {
        return;
    }
    if (isGlobal) {
        return;
    }
    downloadLatestVersion(packageInfo);
}


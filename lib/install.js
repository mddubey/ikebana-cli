var fs = require('fs');
var path = require('path');
var http = require('http');
var extractor = require('./zip-extractor');
var cacheManager =require('./cache-manager');
var downloader = require('./download');
var cachePath = '';

exports.installPackage = function (packageComponent, isGlobal) {
    if (packageComponent.indexOf('@') > -1) {
        return;
    }
    if (isGlobal) {
        return;
    }
    cachePath = cacheManager.getCachePath(packageComponent);
    lookupForLatestVersion(packageComponent);
}

var lookupForLatestVersion = function (packageName) {
    var onResponse = function (response) {
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            var packageInfo = JSON.parse(data)[packageName];
            var latestPackage = packageInfo['latest'].name;
            var packagePath = path.join(cachePath, latestPackage);
            if (fs.existsSync(cachePath) && fs.existsSync(packagePath)) {
                extractor.extractZip(packagePath);
                return;
            }
            downloader.downloadPackage(latestPackage, cachePath);
        });
    };
    var request = http.get("http://10.4.33.146:8080/package-version.json", onResponse);
}



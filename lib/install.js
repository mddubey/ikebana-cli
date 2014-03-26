var fs = require('fs');
var path = require('path');
var http = require('http');
var extractor = require('./zip-extractor');
var cacheManager = require('./cache-manager');
var downloader = require('./download');

exports.installPackage = function (packageComponent, isGlobal) {
    if (packageComponent.indexOf('@') > -1) {
        return;
    }
    if (isGlobal) {
        return;
    }
    lookupForLatestVersion(packageComponent);
}

var downloadWithDependencies = function (packageName, packageRegistry) {
    var packageInfo = packageRegistry[packageName];
    var latestPackage = packageInfo['latest'];
    var dependencies = latestPackage.dependencies;
    dependencies.forEach(function (dependency) {
        var name = dependency.split('-')[0].toLowerCase();
        downloadWithDependencies(name, packageRegistry);
    });
    var cachePath = cacheManager.getCachePath(packageName);
    var packagePath = path.join(cachePath, latestPackage.name);
    if (fs.existsSync(cachePath) && fs.existsSync(packagePath)) {
        extractor.extractZip(packagePath);
    }
    else
        downloader.downloadPackage(latestPackage.name, cachePath);
}

var lookupForLatestVersion = function (packageName) {
    var onResponse = function (response) {
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            var packageRegistry = JSON.parse(data);
            downloadWithDependencies(packageName, packageRegistry);
        });
    };
    var request = http.get("http://10.4.33.146:8080/package-version.json", onResponse);
}



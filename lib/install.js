var installer = {};
installer.fs = require('fs');
installer.path = require('path');
installer.http = require('http');
installer.extractor = require('./zip-extractor');
installer.pathManager = require('./path-manager');
installer.downloader = require('./download');

installer.install = function (packageComponent) {
    if (packageComponent.indexOf('@') > -1) {
        return;
    }
    lookupForLatestVersion(packageComponent);
}

var downloadWithDependencies = function (packageName, packageRegistry) {
    var packageInfo = packageRegistry[packageName];
    var latestPackage = packageInfo['latest'];
    var dependencies = latestPackage.dependencies;
    var downloadDependency = function (dependency) {
        var name = dependency.split('-')[0].toLowerCase();
        downloadWithDependencies(name, packageRegistry);
    };
    dependencies.forEach(downloadDependency);
    var cachePath = installer.pathManager.getCachePath(packageName);
    var packagePath = installer.path.join(cachePath, latestPackage.name);
    var canExtract = installer.fs.existsSync(cachePath) && installer.fs.existsSync(packagePath);
    if (canExtract) {
        console.log('ikebana\t\tinstall\t\tcached\t\t' + latestPackage.name);
        installer.extractor.extractZip(packagePath);
    }
    else {
        installer.downloader.downloadPackage(latestPackage.name, cachePath);
    }
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
            console.log('ikebana\t\tinstall\t\tresolving\t' + url);

            packageRegistry[packageName] || console.log("\nPackage " + packageName + " is not available in registry");
            packageRegistry[packageName] && downloadWithDependencies(packageName, packageRegistry);
        });
    };

    var url = "http://localhost:8080/ikebana.json";
    var request = installer.http.get(url, onResponse);
    request.on('error', function (e) {
        console.log('ikebana:- could not connect to server');
    })
}

exports.installer = installer;
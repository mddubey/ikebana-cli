var os = require('os');
var fs = require('fs');
var path = require('path');
var http = require('http');
var template = require('./template');
var downloader = require('./download');
var exec = require('child_process').exec;

var cachePath = '';

var getCachePath = function (packageName) {
    var systemType = os.type();
    var appDir = '';
    if (systemType.slice(0, 7).toLowerCase() == 'windows')
        appDir = process.env.APPDATA;
    else
        appDir = process.env.HOME;
    return path.join(appDir, 'ikebana-cache', packageName.toLowerCase());
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
            var packagePath = path.join(cachePath, packageInfo['latest']);
            if (fs.existsSync(cachePath) && fs.existsSync(packagePath)) {
                extractZip(packagePath);
                return;
            }
            downloader.downloadPackage(packageInfo['latest'], cachePath);
        });
    };
    var request = http.get("http://10.4.33.146:8080/package-version.json", onResponse);
}

exports.installPackage = function (packageComponent, isGlobal) {
    if (packageComponent.indexOf('@') > -1) {
        return;
    }
    if (isGlobal) {
        return;
    }
    cachePath = getCachePath(packageComponent);
    lookupForLatestVersion(packageComponent);
}

var extractZip = function (zipFile) {
    var unzipCmd = "unzip -qod ikebana_modules ZIP";
    unzipCmd = template.applyTemplate(unzipCmd, {ZIP: zipFile});
    exec(unzipCmd);
}

exports.extractZip = extractZip;


var os = require('os');
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


var downloadLatestVersion = function (packageName) {
    var onResponse = function (response) {
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            var latestPackage = JSON.parse(data)[packageName];
            downloader.downloadPackage(latestPackage['latest'], cachePath);
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
    cachePath = getCachePath(packageInfo);
    downloadLatestVersion(packageInfo);
}

exports.extractZip = function (zipFile) {
    var unzipCmd = "unzip -qod ikebana_modules ZIP";
    unzipCmd = template.applyTemplate(unzipCmd, {ZIP: zipFile});
    exec(unzipCmd);
}


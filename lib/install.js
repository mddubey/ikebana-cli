var os = require('os');
var fs = require('fs');
var path = require('path');
var http = require('http');
var downloader = require('./download');
var spawn = require('child_process').spawn;

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
    var unzip = spawn('unzip', ['-q', '-d', 'ikebana_modules', zipFile]);

    unzip.stderr.setEncoding('utf-8');
    unzip.stderr.on('data', function (data) {
        console.log(data);
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', function () {
            var chunk = process.stdin.read();
            if (chunk !== null) {
                unzip.stdin.write(chunk);
            }
        });
        process.stdin.on('end', function () {
            process.stdout.write('end');
        });
    });

    unzip.stderr.on('end', function () {
        process.stdin.end();
    })
}

exports.extractZip = extractZip;


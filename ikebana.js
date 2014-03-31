var os = require('os');
var fs = require('fs');
var path = require('path');
var http = require('http');
var spawn = require('child_process').spawn;

var operations = {};

var extractZip = function (zipFile) {
    var unzip = spawn('unzip', ['-q', '-o', '-d', 'ikebana_modules', zipFile]);
}

var downloadComponent = function (componentToDownload, cachePath) {
    fs.exists(cachePath, function (exists) {
        exists && downloadZip();
        exists || fs.mkdir(cachePath, downloadZip);
    });

    var downloadZip = function () {
        var componentZip = fs.createWriteStream(path.join(cachePath, componentToDownload));
        var downloadAndExtractZip = function (response) {
            response.pipe(componentZip);
            console.log('ikebana\t\tinstall\t\tnot-cached\t\t' + componentToDownload);
            extractZip(componentZip.path);
        };
        var componentURL = "http://localhost:8080/" + componentToDownload;
        var request = http.get(componentURL, downloadAndExtractZip);
    }
}

var getAppDirPath = function () {
    var systemType = os.type();
    var platformNameStartsWith = systemType.slice(0, 7).toLowerCase();

    var appDir = platformNameStartsWith == 'windows' ? process.env.APPDATA : process.env.HOME;
    return appDir;
};

var getCachePath = function (componentName) {
    var appDir = getAppDirPath();
    var ikebana_cache = path.join(appDir, 'ikebana-cache');

    fs.exists(ikebana_cache, function (exists) {
        exists || fs.mkdir(ikebana_cache, function () {
        });
    })

    return path.join(appDir, 'ikebana-cache', componentName.toLowerCase());
};

var lookupForLatestVersion = function (url, onResponseEnd) {
    var onResponse = function (response) {
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            onResponseEnd(data);
        });
    };

    var request = http.get(url, onResponse);
    var onRequestFailed = function (err) {
        console.log('ikebana:- could not connect to server');
    };
    request.on('error', onRequestFailed);
};

var downloadWithDependencies = function (componentName, componentsList) {
    var componentInfo = componentsList[componentName];
    var latestVersion = componentInfo['latest'];
    var dependencies = latestVersion.dependencies;
    var downloadDependency = function (dependency) {
        var name = dependency.split('-')[0].toLowerCase();
        downloadWithDependencies(name, componentsList);
    };
    dependencies.forEach(downloadDependency);

    var cachePath = getCachePath(componentName);
    var componentPath = path.join(cachePath, latestVersion.name);

    function onCacheExists() {
        return fs.exists(componentPath, function (componentExists) {
            componentExists || downloadComponent(latestVersion.name, cachePath);
            componentExists && extractZip(componentPath);
            componentExists && console.log('ikebana\t\tinstall\t\tcached\t\t' + latestVersion.name);
        });
    }

    fs.exists(cachePath, function (cacheExists) {
        cacheExists || downloadComponent(latestVersion.name, cachePath);
        cacheExists && onCacheExists();
    });
}

var installComponent = function (component) {
    var url = "http://localhost:8080/ikebana.json";

    var readAndDownloadComponent = function (data) {
        var componentsList = JSON.parse(data);
        console.log('ikebana\t\tinstall\t\tresolving\t' + url);
        componentsList[component] || console.log("\nPackage " + component + " is not available in registry");
        componentsList[component] && downloadWithDependencies(component, componentsList);
    };

    if (component.indexOf('@') > -1) {
        return;
    }
    lookupForLatestVersion(url, readAndDownloadComponent);
};

operations.install = function (components) {
    components.forEach(installComponent);
};

operations.uninstall = function (components) {
    console.log('uninstalling:', components);
};

operations.list = function () {
    console.log('list');
};

operations.help = function (command) {
    var msg = ['ikebana:- usage: ikebana <task-name> <component-name>',
        'Tasks: install, uninstall, list and help'].join('\n');
    console.log(msg);
};

var command = process.argv.length > 2 && operations[process.argv[2]] || operations.help;

command(process.argv.slice(3));
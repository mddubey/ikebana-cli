var os = require('os');
var path = require('path');

function getAppDirPath() {
    var systemType = os.type();
    var platformNameStartsWith = systemType.slice(0, 7).toLowerCase();

    var appDir = platformNameStartsWith == 'windows' ? process.env.APPDATA : process.env.HOME;
    return appDir;
}

exports.getCachePath = function (packageName) {
    var appDir = getAppDirPath();
    return path.join(appDir, 'ikebana-cache', packageName.toLowerCase());
}

exports.getInstallationPath = function (isGlobal) {
    var installationPath = 'ikebana_modules';
    if (isGlobal) {
        var appDir = getAppDirPath();
        var ikebanaGlobalDir = path.join(appDir, 'ikebana');
        installationPath = path.join(ikebanaGlobalDir, installationPath);
    }
    return installationPath;
};


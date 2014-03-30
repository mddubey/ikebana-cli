var os = require('os');
var fs = require('fs');
var path = require('path');

function getAppDirPath() {
    var systemType = os.type();
    var platformNameStartsWith = systemType.slice(0, 7).toLowerCase();

    var appDir = platformNameStartsWith == 'windows' ? process.env.APPDATA : process.env.HOME;
    return appDir;
}

exports.getCachePath = function (packageName) {
    var appDir = getAppDirPath();
    var ikebana_cache = path.join(appDir, 'ikebana-cache');
    fs.existsSync(ikebana_cache) || fs.mkdir(ikebana_cache);
    return path.join(appDir, 'ikebana-cache', packageName.toLowerCase());
}

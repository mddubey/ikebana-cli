var os = require('os');
var path = require('path');

exports.getCachePath = function (packageName) {
    var systemType = os.type();
    var platformNameStartsWith = systemType.slice(0, 7).toLowerCase();

    var appDir = platformNameStartsWith == 'windows' ? process.env.APPDATA : process.env.HOME;

    return path.join(appDir, 'ikebana-cache', packageName.toLowerCase());
}

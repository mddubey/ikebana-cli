exports.addInCache = function (package) {
    var cacheDirectory = package.split('-')[0];
    var systemType = require('os').type();
    var appDir = '';
    if (systemType.slice(0, 7).toLowerCase() == 'windows')
        appDir = process.env.APPDATA;
    else
        appDir = process.env.HOME;
    console.log(appDir);
}
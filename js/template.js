exports.applyTemplate = function(template,dictionary){
    var result = template;
    for(var key in dictionary){
        result = result.replace(new RegExp(key,'g'),dictionary[key]);
    }
    return result;
};
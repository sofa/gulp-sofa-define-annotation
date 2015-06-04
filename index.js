'use strict';

var through = require('through2'),
    tmpl    = require('lodash.template'),
    fs      = require('fs'),
    path    = require('path');

function findClass(code) {
    var classPattern = /\s?class ([\S]+)/,
        match = classPattern.exec(code);

    if (match) {
        return match[1];
    } else {
        return false;
    }
}

function findConstructor(code) {
    var constructorPattern = /constructor\(([\s\S]+?)\)/,
        match = constructorPattern.exec(code);

    if (match) {
        return match[1];
    } else {
        return false;
    }
}

var annotationPattern = /\/\/\s?@SofaWrapper[\s\S]+$/;
function findAnnotation(code) {
    var extractAnnotation = /\/\/\s?@SofaWrapper:? ([\S]+)\(([\s\S,]+?)\)/,
        matches = extractAnnotation.exec(code),
        params  = {name: '', args: []};
    
    if (matches) {
        params.name = matches[1];
        params.args = matches[2];
    } else {
        params.name = findClass(code);
        params.args = findConstructor(code);
    }

    return params;
}

var wrapperTmpl = tmpl(fs.readFileSync(path.join(__dirname, 'sofaWrapper.tpl')));
function annotate(code) {
    if (annotationPattern.test(code)) {
        var annotation = findAnnotation(code),
            wrapper = wrapperTmpl(annotation);
        return code.replace(annotationPattern, wrapper);
    } else {
        return code;
    }
}

function annotateStream(fileStream) {
    var outputStream = through(),
        code         = new Buffer('');

    fileStream.on('data', function(data) {
        code = Buffer.concat([code, data]);
    });

    fileStream.on('end', function() {
        var annotated = annotate(code.toString());
        outputStream.write(new Buffer(annotated));
    });

    return outputStream;
}

module.exports = function(config) {
    var config = config || {};

    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
        }

        if (file.isBuffer()) {
            file.contents = new Buffer(annotate(file.contents.toString())); 
        }

        if (file.isStream()) {
            file.contents = annotateStream(file.contents); 
        }

        cb(null, file);
    });
};

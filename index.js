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

function annotateStream() {
    var stripBom = require('strip-bom'),
        code     = new Buffer(''),
        transform;

    transform = through(function(chunk, enc, cb) {
        code = Buffer.concat([code, chunk]);
        cb(null);
    }, function(cb) {
        var annotated = annotate(code.toString());
        this.push(annotated);
        cb();
    });

    return stripBom.stream().pipe(transform);
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
            file.contents = file.contents.pipe(annotateStream());
        }

        cb(null, file);
    });
};

'use strict';
import through from 'through2';
import tmpl from 'lodash.template';
import fs from 'fs';
import path from 'path';

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

const annotationPattern = /\/\/\s?@SofaWrapper[\s\S]+$/;
function findAnnotation(code) {
    var extractAnnotation = /\/\/\s?@SofaWrapper:? ([\S]+)\(([\s\S,]+?)\)/,
        matches = extractAnnotation.exec(code),
        params  = {name: '', args: []};
    
    if (matches) {
        let [,name,args] = matches;
        params = {name, args};
    } else {
        params.name = findClass(code);
        params.args = findConstructor(code);
    }

    return params;
}

import wrapperTmpl from './sofaWrapper.tpl.js';
function annotate(code) {
    if (annotationPattern.test(code)) {
        var annotation = findAnnotation(code),
            wrapper = wrapperTmpl(annotation);
        return code.replace(annotationPattern, wrapper);
    } else {
        return code;
    }
}

import stripBom from 'strip-bom';
function annotateStream() {
    var code = new Buffer(''),
        transform;

    transform = through((chunk, enc, cb) => {
        code = Buffer.concat([code, chunk]);
        cb(null);
    }, function(cb) {
        this.push(annotate(code.toString()));
        cb();
    });

    return stripBom.stream().pipe(transform);
}

export default function() {
    return through.obj((file, enc, cb) => {
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

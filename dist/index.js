'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var _lodashTemplate = require('lodash.template');

var _lodashTemplate2 = _interopRequireDefault(_lodashTemplate);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sofaWrapperTplJs = require('./sofaWrapper.tpl.js');

var _sofaWrapperTplJs2 = _interopRequireDefault(_sofaWrapperTplJs);

var _stripBom = require('strip-bom');

var _stripBom2 = _interopRequireDefault(_stripBom);

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
        params = { name: '', args: [] };

    if (matches) {
        var _matches = _slicedToArray(matches, 3);

        var _name = _matches[1];
        var args = _matches[2];

        params = { name: _name, args: args };
    } else {
        params.name = findClass(code);
        params.args = findConstructor(code);
    }

    return params;
}

function annotate(code) {
    if (annotationPattern.test(code)) {
        var annotation = findAnnotation(code),
            wrapper = (0, _sofaWrapperTplJs2['default'])(annotation);
        return code.replace(annotationPattern, wrapper);
    } else {
        return code;
    }
}

function annotateStream() {
    var code = new Buffer(''),
        transform;

    transform = (0, _through22['default'])(function (chunk, enc, cb) {
        code = Buffer.concat([code, chunk]);
        cb(null);
    }, function (cb) {
        this.push(annotate(code.toString()));
        cb();
    });

    return _stripBom2['default'].stream().pipe(transform);
}

exports['default'] = function () {
    return _through22['default'].obj(function (file, enc, cb) {
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

;
module.exports = exports['default'];
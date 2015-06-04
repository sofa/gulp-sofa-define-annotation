"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (data) {
    return "if (sofa) {\n    sofa.define('sofa." + data.name + "', function(" + data.args + ") {\n        return new " + data.name + "(" + data.args + ");\n    });\n}\n";
};

;
module.exports = exports["default"];
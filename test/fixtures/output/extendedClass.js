'use strict';
import Something from 'somewhere';

class Test extends Parent {
    constructor(param1, param2) {
        this.param1 = param1;
        this.param2 = param2
    }

    method(args) {
        return args.join(':');
    }
}

if (sofa) {
    sofa.define('sofa.Test', function(param1, param2) {
        return new Test(param1, param2);
    });
}


import Something from 'somewhere';

class Test {
    constructor() {
        this.instVar = true;
    }

    method(args) {
        return args.join(':');
    }
}

if (sofa) {
    sofa.define('sofa.Test', function() {
        return new Test();
    });
}

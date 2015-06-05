
require('mocha');
require('should');
require('should-sinon');

var sinon = require('sinon'),
    fs    = require('fs'),
    path  = require('path'),
    rfs   = function(filePath) {
        if (!cache[filePath]) {
            cache[filePath] = fs.readFileSync(path.join(__dirname, 'fixtures', filePath), {encoding: 'utf8'});
        }
        return cache[filePath];
    },
    cache = {};

suite('sofa.define Wrapper Karma Plugin:', function() {
    var plugin = require('..').karmaPlugin[1];

    test('should be defined', function() {
        plugin.should.exist;
        plugin.$inject.should.exist;
        plugin.should.be.a.Function;
    });

    test('transform', function(done) {
        var fakeDebug = sinon.spy(),
            fakeLogger = {
                create: function() {
                    return {
                        debug: fakeDebug
                    }
                }
            },
            inst = plugin(fakeLogger);

        inst(rfs('src/fullyAnnotated.js'), {originalPath: 'test'}, function(err, content) {
            content.should.be.equal(rfs('output/fullyAnnotated.js'));
            fakeDebug.should.be.calledOnce;
            done();
        });
    });
    
     
});

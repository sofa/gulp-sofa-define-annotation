
require('mocha');
require('should');

var es       = require('event-stream'),
    stripBom = require('strip-bom'),
    File     = require('vinyl'),
    fs       = require('fs'),
    path     = require('path'),
    rfs      = function(filePath) {
        if (!cache[filePath]) {
            cache[filePath] = fs.readFileSync(path.join(__dirname, 'fixtures', filePath), {encoding: 'utf8'});
        }
        return cache[filePath];
    },
    cache = {};

suite('sofa.define Wrapper Gulp Task:', function() {
    var plugin = require('..');
    
    suite('transform fully annotated class file', function() {
        test('from stream', function(done) {
            var srcFile = new File({
                    contents: fs.createReadStream(path.join(__dirname, 'fixtures/src/fullyAnnotated.js')).pipe(stripBom.stream())
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isStream().should.equal(true);
                    file.contents.pipe(es.wait(function(err, data) {
                        data.toString().should.equal(rfs('output/fullyAnnotated.js'));
                        done(err);
                    }));
                });
        });

        test('from buffer', function(done) {
            var srcFile = new File({
                    contents: new Buffer(rfs('src/fullyAnnotated.js'))
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isBuffer().should.equal(true);
                    file.contents.toString().should.equal(rfs('output/fullyAnnotated.js'));
                    done();
                });
        });
    });

    suite('transform shortly annotated class file', function() {
        test('from buffer', function(done) {
            var srcFile = new File({
                    contents: new Buffer(rfs('src/shortAnnotation.js'))
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isBuffer().should.equal(true);
                    file.contents.toString().should.equal(rfs('output/shortAnnotation.js'));
                    done();
                });
        });

        test('from stream', function(done) {
            var srcFile = new File({
                    contents: fs.createReadStream(path.join(__dirname, 'fixtures/src/shortAnnotation.js')).pipe(stripBom.stream())
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isStream().should.equal(true);
                    file.contents.pipe(es.wait(function(err, data) {
                        data.toString().should.equal(rfs('output/shortAnnotation.js'));
                        done(err);
                    }));
                });
        });
    });

    suite('transform shortly annotated class without constructor parameters', function() {
        test('from buffer', function(done) {
            var srcFile = new File({
                    contents: new Buffer(rfs('src/shortAnnotationWithNoParams.js'))
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isBuffer().should.equal(true);
                    file.contents.toString().should.equal(rfs('output/shortAnnotationWithNoParams.js'));
                    done();
                });
        });

        test('from stream', function(done) {
            var srcFile = new File({
                    contents: fs.createReadStream(path.join(__dirname, 'fixtures/src/shortAnnotationWithNoParams.js')).pipe(stripBom.stream())
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isStream().should.equal(true);
                    file.contents.pipe(es.wait(function(err, data) {
                        data.toString().should.equal(rfs('output/shortAnnotationWithNoParams.js'));
                        done(err);
                    }));
                });
        });
    });


    suite('transform extended class', function() {
        test('from buffer', function(done) {
            var srcFile = new File({
                    contents: new Buffer(rfs('src/extendedClass.js'))
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isBuffer().should.equal(true);
                    file.contents.toString().should.equal(rfs('output/extendedClass.js'));
                    done();
                });
        });

        test('from stream', function(done) {
            var srcFile = new File({
                    contents: fs.createReadStream(path.join(__dirname, 'fixtures/src/extendedClass.js')).pipe(stripBom.stream())
                }),
                pluginStream = plugin();        

            pluginStream.write(srcFile);

            pluginStream.once('data', function(file) {
                    file.isStream().should.equal(true);
                    file.contents.pipe(es.wait(function(err, data) {
                        data.toString().should.equal(rfs('output/extendedClass.js'));
                        done(err);
                    }));
                });
        });
    });
});

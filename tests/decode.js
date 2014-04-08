'use strict';

var _      = require('underscore');
var base85 = require('../lib/base85');
var data   = require('./data').data;

exports.testErrors = function(test)
{
  test.equal(base85.decode(1234, 'ascii85'), false);
  test.equal(base85.decode('<~u~>', 'ascii85'), false);
  test.equal(base85.decode('<~uuuuu~>', 'ascii85'), false);
  test.done();
};

exports.testBasic = function(test)
{
  var encodings = [ 'ascii85', 'z85' ];
  test.expect(data.length * encodings.length);

  _.each(encodings, function(encoding) {
    _.each(data, function (tc) {
      var exp = typeof tc.raw === 'string' ? new Buffer(tc.raw) : tc.raw;
      test.deepEqual(base85.decode(tc.enc[encoding], encoding), exp);
    });
  });

  test.done();
};

exports.testWhiteSpace = function(test)
{
  test.deepEqual(base85.decode('<~\n@p\ns7\ntD.3~>', 'ascii85'), new Buffer('canumb'));
  test.deepEqual(base85.decode('<~\n @  p \ns7 \n t D .3~>', 'ascii85'), new Buffer('canumb'));
  test.deepEqual(base85.decode('<~\n @  p \ns7 \n t D .3            ~>', 'ascii85'), new Buffer('canumb'));
  test.deepEqual(base85.decode('<~@ps7tD.3        \n    ~>', 'ascii85'), new Buffer('canumb'));
  test.deepEqual(base85.decode('<~       @ps7tD.3     \n     ~>', 'ascii85'), new Buffer('canumb'));

  test.deepEqual(base85.decode('v{ \n    % \t  m$z   di'), new Buffer('canumb'));
  test.done();
};

var album = require('../lib/album-s3.js')({ staticFiles : 'test/photos', urlRoot : '' }),
assert = require('assert'),
request = {
  path : 'album1',
  s3Bucket : 'test-node-gallery',
  s3Region : 'us-west-2'
},
response = {
  json : function(jsonResponse){
    // shouldn't get here
    console.log(jsonResponse);
    assert.ok(!jsonResponse, 'Got json response, expected res.render');
  },
  status : function(code){
    // shouldn't happen
    console.log('Error - got response code ' + code);
    return response;
  }
},
next =  function(){
  // call to common.render
  assert.ok(request.data, 'Request should have data to render');
  assert.ok(request.tpl, 'Request should have a tpl to render');
  assert.ok(request.data.photos.length === 1, 'Request should have one data photos');
  console.log(__filename + ' passed ok ✓')
};

album(request, response, next);

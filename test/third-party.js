const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const tpProcessor = require('../processors/third-party');

chai.use(chaiAsPromised);

describe('Third Party', function() {
  it('POST Third Party', function(done) {
  });

  it('PUT Third Party', function(done) {
    done();
  });

  it('DELETE Third Party', function(done) {
    done();
  });

  it('Analyzes Third Party data and saves', function(done) {
    //tpProcessor.evalSpotify()
    done();
  });
});

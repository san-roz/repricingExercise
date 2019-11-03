const mocha =        require('mocha');
const assert =       require('assert');
const rewire =       require('rewire');
const errors =       require('../../utils/errors');
const testsData =    require('../../test/data');
const lastPrices =   require('../../data/lastPrices.json');

describe('searchForProductPrice func', () => {
  it('should equal', (done) => {
    const fileLogHandler = rewire('../../utils/fileLogHandler.js');
    const searchForProductPrice = fileLogHandler.__get__("searchForProductPrice");
    const productId = testsData.productId;
    lastPrices[productId] = testsData.latestPrices[productId];
    searchForProductPrice(productId)
    .then(productInfo => {
      assert.deepEqual(productInfo, lastPrices[productId]);
      done();
    })
    .catch(err => done(err))
  })
  
  it('should not equal', (done) => {
    const fileLogHandler = rewire('../../utils/fileLogHandler.js');
    const searchForProductPrice = fileLogHandler.__get__("searchForProductPrice");
    const productId = -999;
    searchForProductPrice(productId)
    .then(productInfo => done(new error("should go to catch")))
    .catch(err => {
      assert.deepEqual(err, errors.NOT_FOUND("product"));
      done();
    })
  })
})

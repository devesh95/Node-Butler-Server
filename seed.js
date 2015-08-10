var seeder = require('seeder');
var mongo = require('./mongowrapper');
var dataWrapper = require('./mockDataWrapper');
var testData = require('./testData');

/* FOR TESTING & DEVELOPMENT PURPOSES. */

var seedDb = function(done) {
  dataWrapper.dropDatabase(function() {
    seeder(testData, mongo.mongoose, function(err) {
      if (err) {
        console.log(err);
      } else {
        done();
      }
    });
  });
};

module.exports.seedDb = seedDb;

(function() {
  seedDb(function() {
    console.log('Your database has been seeded.');
    process.exit();
  });
})();
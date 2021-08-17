const rimraf = require('rimraf');

module.exports = function () {
  rimraf.sync('/tmp/token-cli-test-workdir');
};

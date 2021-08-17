var fs = require('fs');
var dir = '/tmp/token-cli-test-workdir';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

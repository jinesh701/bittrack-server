exports.DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost/bittrack';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-bittrack';
exports.PORT = process.env.PORT || 8080;

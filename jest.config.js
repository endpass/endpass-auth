const objectUtils = require('@endpass/utils/objects');

module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'node'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpe?g|ttf|woff2?|pdf)$':
      'jest-transform-stub',
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!(vue-timers|@endpass/class))'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@unitFixtures/(.*)$': '<rootDir>/tests/unit/fixtures/$1',
    '^@mocks/(.*)$': '<rootDir>/tests/unit/mocks/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/',
  setupFiles: ['<rootDir>/tests/unit/setup'],
  globals: {
    ENV: objectUtils.parseObjectProperties(process.env, 'VUE_APP'),
  },
};

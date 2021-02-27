module.exports = {
  testMatch: [
    '<rootDir>/**/__tests__/unit/?(*.)(spec|test).js',
    '<rootDir>/**/__tests__/integration/?(*.)(spec|test).js'
  ],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/resources/**/*.service.js',
    '<rootDir>/src/resources/**/*.repository.js',
  ],
  coverageDirectory: '<rootDir>/src/__tests__/coverage',
  testTimeout: 30000
}
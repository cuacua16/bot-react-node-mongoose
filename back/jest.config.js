export default {
  moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  transform: { "^.+\\.js$": "babel-jest" },
  transformIgnorePatterns: [
    "node_modules/(?!auto-bind)"
  ]
};
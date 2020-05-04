/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  rootDir: 'src/app',
  testRegex: '.spec.ts$',
  coverageDirectory: join(__dirname, 'coverage'),
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  testTimeout: 15000,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `${__dirname}/`,
  }),
};

module.exports = {
  collectCoverageFrom: ['src/index.ts'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  resetMocks: true,
  // DEV
  // testEnvironment: 'jest-environment-jsdom-global',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  verbose: true,
  // DEV
  // watchPathIgnorePatterns: ['/entries/', '/data/', '/locales/'],
};

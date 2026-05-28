/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/setup/load-env.ts'],
  globalSetup: '<rootDir>/tests/setup/global-setup.ts',
  globalTeardown: '<rootDir>/tests/setup/global-teardown.ts',
  testTimeout: 30000,
  moduleNameMapper: {
    '^@/server/s3$': '<rootDir>/tests/setup/__mocks__/s3.ts',
    '^@/lib/posthog-server$': '<rootDir>/tests/setup/__mocks__/posthog-server.ts',
    '^sharp$': '<rootDir>/tests/setup/__mocks__/sharp.ts',
    '^uuid$': '<rootDir>/tests/setup/__mocks__/uuid.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'preserve',
        module: 'commonjs',
        moduleResolution: 'node',
        target: 'es2020',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
        skipLibCheck: true,
        resolveJsonModule: true,
        isolatedModules: true,
        baseUrl: '.',
        paths: { '@/*': ['./src/*'] },
      },
      diagnostics: false,
    }],
  },
  transformIgnorePatterns: ['/node_modules/'],
}

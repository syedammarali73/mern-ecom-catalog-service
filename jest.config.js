import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset();

/** @type {import('jest').Config} */
const config = {
    ...presetConfig,
    testEnvironment: 'node',
    verbose: true,
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts', '!tests/**', '!**node_modules/**'],
};

export default config;

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleNameMapper: {
  '^@configuration/(.*)$': '<rootDir>/src/configuration/$1',
  '^@util/(.*)$': '<rootDir>/src/util/$1',
  '^@common/(.*)$': '<rootDir>/src/common/$1',
},
};

export default config;
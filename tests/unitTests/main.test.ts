import { jest } from '@jest/globals';

const mockGetIntValue = jest.fn().mockReturnValue(3000);
const mockListen = jest.fn();
const mockSetup = jest.fn();

jest.mock('tsyringe', () => {
  return {
    container: {
      resolve: (cls: any) => {
        switch (cls.name) {
          case 'EnvironmentConfiguration':
            return { getIntValue: mockGetIntValue };
          case 'ExpressConfiguration':
            return {
              getExpressApplication: () => ({
                listen: mockListen,
              }),
            };
          case 'DatabaseConfiguration':
          case 'RouteConfiguration':
            return {};
          case 'SwaggerConfiguration':
            return { setup: mockSetup };
          default:
            throw new Error(`Classe não mockada: ${cls.name}`);
        }
      },
    },
    singleton: () => () => {},
    injectable: () => () => {},
  };
});

jest.mock('@util/logger.util', () => ({
  logger: {
    info: jest.fn(),
  },
}));

describe('main.ts', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('Must start the server on port 3000', async () => {
    const { main } = await import('../../src/main');
    await main();

    expect(mockGetIntValue).toHaveBeenCalled();
    expect(mockListen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(mockSetup).toHaveBeenCalled();
  });
});

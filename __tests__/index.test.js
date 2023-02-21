const FileSystem = require('expo-file-system');
const { loadEnv, getEnv } = require('../index');

// Mock the FileSystem module
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  getInfoAsync: jest.fn(),
}));

describe('loadEnv', () => {
  beforeEach(() => {
    FileSystem.readAsStringAsync.mockReset();
    FileSystem.getInfoAsync.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load environment variables from .env file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.local file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.local');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.development file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.development');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.development.local file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.development.local');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.production file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.production');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.production.local file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.production.local');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.test file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.test');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from .env.test.local file', async () => {
    const mockContents = 'VAR1=value1\nVAR2=value2\n';
    FileSystem.readAsStringAsync.mockResolvedValue(mockContents);
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true });
    const env = await loadEnv('.env.test.local');
    expect(env).toEqual({ VAR1: 'value1', VAR2: 'value2' });
  });

  it('should load environment variables from multiple files with correct priority', async () => {
    const mockContents1 = 'VAR1=value1\nVAR2=value2\nVAR3=value3\n';
    const mockContents2 = 'VAR1=value4\nVAR3=value5\nVAR4=value6\n';

    FileSystem.readAsStringAsync.mockImplementation((filename) => {
      switch (filename) {
        case '.env':
          return Promise.resolve(mockContents1);
        case '.env.local':
          return Promise.resolve(mockContents2);
        default:
          return Promise.reject(new Error(`File not found: ${filename}`));
      }
    });

    FileSystem.getInfoAsync.mockImplementation((filename) => {
      switch (filename) {
        case '.env':
        case '.env.local':
        case '.env.test.local':
          return Promise.resolve({ exists: true });
        default:
          return Promise.reject(new Error(`File not found: ${filename}`));
      }
    });
    const env = await loadEnv();
    expect(env).toEqual({ VAR1: 'value4', VAR2: 'value2', VAR3: 'value5', VAR4: 'value6' });
  });

  it('should return empty object if no env files found', async () => {
    FileSystem.getInfoAsync.mockResolvedValue({ exists: false });
    const env = await loadEnv();
    expect(env).toEqual({});
  });
});

describe('getEnv', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    process.env = {};
  });

  it('should return undefined if env var not found', () => {
    const value = getEnv('VAR1');
    expect(value).toBe(null);
  });

  it('should return value of env var if found', () => {
    process.env.VAR1 = 'value1';
    const value = getEnv('VAR1');
    expect(value).toBe('value1');
  });
});

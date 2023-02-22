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

  it('should load the highest priority environment file that exists', async () => {
    FileSystem.readAsStringAsync.mockResolvedValue('FOO=bar\nBAZ=qux');

    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: false });
    FileSystem.getInfoAsync.mockResolvedValueOnce({ exists: true });
  
    const env = await loadEnv();
  
    expect(env).toEqual({ FOO: 'bar', BAZ: 'qux' });
  
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('.env.test.local');
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith('.env.local');
    expect(FileSystem.getInfoAsync).not.toHaveBeenCalledWith('.env.production.local');
    expect(FileSystem.getInfoAsync).not.toHaveBeenCalledWith('.env.production');
    expect(FileSystem.getInfoAsync).not.toHaveBeenCalledWith('.env.development.local');
    expect(FileSystem.getInfoAsync).not.toHaveBeenCalledWith('.env.development');
  });

  it('should return an empty object if no environment file exists', async () => {
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

const FileSystem = require('expo-file-system');
const { get } = require('lodash');

const DEFAULT_ENV = 'development';
const PRIORITY_ENVS = [
  { env: 'test', filenames: ['.env.test.local', '.env.local', '.env.test', '.env'] },
  { env: 'production', filenames: ['.env.production.local', '.env.local', '.env.production', '.env'] },
  { env: 'development', filenames: ['.env.development.local', '.env.local', '.env.development', '.env'] },
];

const getEnvFilename = async () => {
  const { NODE_ENV = DEFAULT_ENV } = process.env;
  const priorityEnvs = PRIORITY_ENVS.filter(({ env }) => env === NODE_ENV);
  const filenames = priorityEnvs.flatMap(({ filenames }) => filenames);

  for (const filename of filenames) {
    const fileInfo = await FileSystem.getInfoAsync(filename);
    if (fileInfo.exists) {
      return filename;
    }
  }

  return null;
};

const parseEnvVars = (contents) => {
  return contents.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    return key ? { ...acc, [key]: value } : acc;
  }, {});
};

export const loadEnv = async () => {
  const fileName = await getEnvFilename();

  try {
    const contents = await FileSystem.readAsStringAsync(fileName);
    console.error(contents)
    return parseEnvVars(contents);
  } catch (error) {
    console.error(`Failed to load env file ${fileName}`, error);
    return {};
  }
};

export const getEnv = (key, defaultValue = null) => {
  const value = get(process.env, key, defaultValue);
  if (value === null) {
    console.warn(`Environment variable '${key}' is not defined`);
  }
  return value;
};
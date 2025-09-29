import devConfigs from './dev';
import localConfigs from './local';
import prodConfigs from './prod';

let currentConfigs = localConfigs;

if (process.env.NODE_ENV === 'production') {
  currentConfigs = prodConfigs;
} else if (process.env.NODE_ENV === 'development') {
  currentConfigs = devConfigs;
}

export const configs = { ...currentConfigs };

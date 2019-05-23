import pick from 'lodash/pick';
import { LS_SETTINGS } from '@/constants';

const getLocalSettingsKey = () => `${window.location.hostname}:${LS_SETTINGS}`;

const getLocalSettings = () => {
  const settings = localStorage.getItem(getLocalSettingsKey());

  if (!settings) return {};

  return JSON.parse(settings);
};

const setLocalSettings = settings => {
  const prevSettings = getLocalSettings();
  const updatedSettings = {
    ...prevSettings,
    ...pick(settings, ['lastActiveAccount', 'net']),
  };

  localStorage.setItem(getLocalSettingsKey(), JSON.stringify(updatedSettings));
};

const clearLocalSettings = () => {
  localStorage.removeItem(getLocalSettingsKey());
};

/**
 * Merge stored settings with new.
 * Stored settings have priority to merge
 *
 * @param {Object} settings new settings
 * @returns {Object}
 */
const mergeSettings = settings => {
  const localSettings = getLocalSettings();

  return {
    ...pick(settings, ['lastActiveAccount', 'net']),
    ...localSettings,
  };
};

export default {
  getLocalSettings,
  setLocalSettings,
  clearLocalSettings,
  mergeSettings,
};

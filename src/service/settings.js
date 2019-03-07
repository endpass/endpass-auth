import pick from 'lodash/pick';
import { LS_SETTINGS } from '@/constants';

export const getLocalSettingsKey = () =>
  `${window.location.hostname}:${LS_SETTINGS}`;

export const getLocalSettings = () => {
  const settings = localStorage.getItem(getLocalSettingsKey());

  if (!settings) return {};

  return JSON.parse(settings);
};

export const setLocalSettings = settings => {
  const prevSettings = getLocalSettings();
  const updatedSettings = {
    ...prevSettings,
    ...pick(settings, ['lastActiveAccount', 'net']),
  };

  localStorage.setItem(getLocalSettingsKey(), JSON.stringify(updatedSettings));
};

export const clearLocalSettings = () => {
  localStorage.removeItem(getLocalSettingsKey());
};

/**
 * Merge stored settings with new.
 * Stored settings have priority to merge
 *
 * @param {Object} settings new settings
 * @returns {Object}
 */
export const mergeSettings = settings => {
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

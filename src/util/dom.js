/* eslint-disable import/prefer-default-export */
export const inlineStyles = styles =>
  Object.keys(styles).reduce((acc, key) => `${acc}${key}: ${styles[key]};`, '');

const parser = document.createElement('a');

export const parseUrl = url => {
  parser.href = url;
  return parser;
};

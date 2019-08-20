const parser = document.createElement('a');

export const parseUrl = url => {
  parser.href = url;
  return parser;
};

export default {
  parseUrl,
};

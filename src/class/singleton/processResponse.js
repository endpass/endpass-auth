// import store from '@/store';
// import { DEFAULT_RATE_LIMIT_TIMEOUT } from '@/constants';

import mapToQueryString from '@endpass/utils/mapToQueryString';

const CODES = {
  RATE_LIMIT: 429,
  BAN: 423,
};

const methods = {
  // eslint-disable-next-line no-unused-vars
  [CODES.RATE_LIMIT](response) {
    // TODO: add rate limit after server fix
    // store.commit(
    //   'setRateLimitTimeout',
    //   response.timeout || DEFAULT_RATE_LIMIT_TIMEOUT,
    // );
  },
  [CODES.BAN]() {
    const path = mapToQueryString('/public/error', {
      error: encodeURIComponent('You are banned!'),
      error_description: encodeURIComponent(
        'You were banned by the administration',
      ),
    });
    window.history.replaceState({}, '', path);
  },
};

export default function(response = {}) {
  const { status: statusCode } = response;
  if (!methods[statusCode]) {
    return;
  }

  methods[statusCode](response);
}

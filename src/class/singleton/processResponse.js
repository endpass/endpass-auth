import store from '@/store';
import router from '@/router';
import { DEFAULT_RATE_LIMIT_TIMEOUT } from '@/constants';

import mapToQueryString from '@endpass/utils/mapToQueryString';

const CODES = {
  RATE_LIMIT: 429,
  BAN: 423,
  DISABLED: 410,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

const methods = {
  [CODES.RATE_LIMIT](response) {
    store.commit(
      'setRateLimitTimeout',
      response.timeout || DEFAULT_RATE_LIMIT_TIMEOUT,
    );
  },
  [CODES.BAN]() {
    const path = mapToQueryString('/public/error', {
      error: encodeURIComponent('You are banned!'),
      error_description: encodeURIComponent(
        'You were banned by the administration',
      ),
    });
    setTimeout(() => {
      router.replace(path);
    }, 100);
  },
  [CODES.DISABLED]() {
    const path = mapToQueryString('/public/error', {
      error: encodeURIComponent('Your account is disabled!'),
      error_description: encodeURIComponent(
        'Your account was disabled by the Endpass administration',
      ),
    });
    setTimeout(() => {
      router.replace(path);
    }, 100);
  },
  [CODES.UNAUTHORIZED]() {
    const { isWidget } = router.currentRoute.meta;

    if (isWidget) {
      store.dispatch('unmountWidget');
    }
  },
  [CODES.FORBIDDEN]() {
    const { isWidget } = router.currentRoute.meta;

    if (isWidget) {
      store.dispatch('unmountWidget');
    }
  },
};

export default function(response = {}) {
  const { status: statusCode } = response;

  if (!methods[statusCode]) {
    return;
  }

  methods[statusCode](response);
}

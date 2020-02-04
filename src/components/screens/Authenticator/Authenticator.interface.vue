<template>
  <auth-container
    @authorize="onAuth"
    @cancel="onCancel"
  />
</template>

<script>
import AuthContainer from './Authenticator.state';

export default {
  name: 'AuthenticatorInterface',

  data: () => ({
    backRedirectRoute: {},
  }),

  // TODO: maybe, we should move to 'module layer' or mixin (composition api)
  beforeRouteEnter(to, from, next) {
    if (to.query.isDropForward && to.name === 'SignIn') {
      next(vm => {
        // eslint-disable-next-line
        vm.backRedirectRoute = from;
      });
      return;
    }

    next({
      ...to,
      name: 'SignIn',
      query: {
        ...to.query,
        isDropForward: true,
      },
      params: {
        ...to.params,
        isForward: true,
      },
      replace: true,
    });
  },

  beforeRouteUpdate(to, from, next) {
    const defaultTo = {
      ...to,
      query: {
        ...to.query,
        isDropForward: true,
      },
      params: {
        ...to.params,
        isForward: true,
      },
    };

    if (from.query.isDropForward && !to.query.isDropForward) {
      next(defaultTo);
    } else if (!to.query.isDropForward || to.params.isForward) {
      next();
    } else if (!to.query.isObsolete) {
      next({
        ...defaultTo,
        query: {
          ...defaultTo.query,
          isObsolete: true,
        },
        replace: true,
      });
      next(defaultTo);
    } else if (to.query.isObsolete) {
      this.$router.back();
    }
  },

  methods: {
    onAuth({ serverMode } = {}) {
      this.makeRedirect({
        isAuthSuccess: true,
        serverMode,
      });
    },

    onCancel() {
      this.makeRedirect({
        isAuthCancel: true,
      });
    },

    makeRedirect(params) {
      const redirectRoute = {
        ...this.backRedirectRoute,
        params,
      };

      this.$router.push(redirectRoute);
    },
  },

  components: {
    AuthContainer,
  },
};
</script>

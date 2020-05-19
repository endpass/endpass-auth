<template>
  <section class="permission-group">
    <p class="permission-group-title">
      {{ scopesTitle }}
    </p>
    <p
      v-if="!isScopesEmpty"
      class="permission-group-scopes"
    >
      {{ $t('components.scopes.access') }} {{ scopesDescription }}
    </p>
  </section>
</template>

<script>
import camelCase from 'lodash/camelCase';
import { SCOPES_TRANSLATES } from '@/constants/translates';

export default {
  name: 'PermissionGroup',

  props: {
    rootScope: {
      type: String,
      required: true,
    },

    scopes: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isScopesEmpty() {
      return this.scopes.length === 0;
    },

    scopesTitle() {
      const normalizedKey = this.normalizeScopeKey(this.rootScope);

      return SCOPES_TRANSLATES[normalizedKey] || normalizedKey;
    },

    scopesDescription() {
      const normalizedKeys = this.scopes.map(scope =>
        this.normalizeScopeKey(this.rootScope, scope),
      );
      const translatedScopes = normalizedKeys.map(
        scope => SCOPES_TRANSLATES[scope] || scope,
      );

      return translatedScopes.join(', ').toLowerCase();
    },
  },

  methods: {
    normalizeScopeKey(...scopes) {
      return camelCase(
        scopes
          .join(':')
          .split(':')
          .join('-'),
      );
    },
  },
};
</script>

<style lang="postcss">
.permission-group {
  font-size: 14px;
  line-height: 1.43;
}

.permission-group-title {
  margin-bottom: 4px;
  font-weight: bold;
}

.permission-group-scopes {
  letter-spacing: -0.175px;
}
</style>

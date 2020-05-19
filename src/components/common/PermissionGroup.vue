<template>
  <section class="permission-group">
    <p class="permission-group-title">
      {{ title }}
    </p>
    <ul
      v-if="!isScopesEmpty"
      class="permission-group-scopes"
    >
      <li
        v-for="scope in scopes"
        :key="scope"
        class="permission-group-scopes-item"
      >
        {{ getScopeTitle(scope) }}
      </li>
    </ul>
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

    title() {
      const normalizedKey = this.normalizeScopeKey(this.rootScope);

      return SCOPES_TRANSLATES[normalizedKey] || normalizedKey;
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

    getScopeTitle(scope) {
      const normalizedKey = this.normalizeScopeKey(this.rootScope, scope);

      return SCOPES_TRANSLATES[normalizedKey] || normalizedKey;
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
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  letter-spacing: -0.175px;
}

.permission-group-scopes-item {
  text-transform: lowercase;
}

.permission-group-scopes-item:first-child:first-letter {
  text-transform: uppercase;
}

.permission-group-scopes-item:not(:last-child):after {
  content: ',';
}
</style>

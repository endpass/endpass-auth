<template>
  <form
    class="scopes-form"
    @submit.prevent="handleSubmit"
  >
    <form-field>
      <v-description>
        {{ $t('components.scopes.allowScopes') }}
      </v-description>
    </form-field>
    <div class="form-field v-mb-24">
      <ul class="scopes-form-groups">
        <li
          v-for="(value, key) in grouppedScopes"
          :key="key"
          class="scopes-form-group"
        >
          <permission-group
            :root-scope="key"
            :scopes="value"
          />
        </li>
      </ul>
    </div>
    <form-controls>
      <v-button
        :disabled="isLoading"
        :is-loading="isLoading"
        :fluid="true"
        type="primary"
        data-test="submit-button"
      >
        {{ $t('global.allow') }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import VDescription from '@/components/common/VDescription';
import PermissionGroup from '@/components/common/PermissionGroup';

export default {
  name: 'ScopesForm',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },

    scopesList: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isPopup() {
      return !!window.opener;
    },

    grouppedScopes() {
      const grouppedScopes = {};

      this.scopesList.forEach(scope => {
        const splittedScope = scope.split(':');

        if (splittedScope.length === 1) {
          grouppedScopes[splittedScope[0]] = [];
          return;
        }

        const scopeKeyParts = splittedScope.slice(0, splittedScope.length - 2);
        const scopeValueParts = splittedScope.slice(scopeKeyParts.length);
        const scopeKey = scopeKeyParts.join(':');
        const scopeValue = scopeValueParts.join(':');

        if (!grouppedScopes[scopeKey]) {
          grouppedScopes[scopeKey] = [scopeValue];
          return;
        }

        grouppedScopes[scopeKey].push(scopeValue);
      });

      return grouppedScopes;
    },
  },

  methods: {
    handleSubmit() {
      this.$emit('submit', this.scopesList);
    },
  },

  components: {
    VButton,
    FormField,
    FormControls,
    VDescription,
    PermissionGroup,
  },
};
</script>

<style lang="postcss">
.scopes-form-group {
  padding: 6px 0;
}

.scopes-form-group:not(:last-child) {
  border-bottom: 1px solid #f2f4f8;
}
</style>

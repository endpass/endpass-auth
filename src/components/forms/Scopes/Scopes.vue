<template>
  <form
    class="scopes-form"
    @submit.prevent="onSubmit"
  >
    <form-field>
      <v-description>
        <strong>{{ appName }}</strong>
        {{ $t('components.scopes.allowScopes') }}
      </v-description>
    </form-field>
    <div class="form-field v-mb-24">
      <ul class="scopes-form-groups">
        <li
          v-for="(value, key) in groupedScopes"
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
import { PUBLIC_SCOPES } from '@/constants';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import VDescription from '@/components/common/VDescription';
import PermissionGroup from './modules/PermissionGroup';

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

    appName: {
      type: String,
      default: '',
    },
  },

  computed: {
    filteredScopes() {
      return this.scopesList.filter(
        scope => scope !== PUBLIC_SCOPES.OFFLINE_ACCESS,
      );
    },

    groupedScopes() {
      const groupedScopes = {};

      this.filteredScopes.forEach(scope => {
        const splittedScope = scope.split(':');

        if (splittedScope.length === 1) {
          groupedScopes[splittedScope[0]] = [];
          return;
        }

        const scopeKeyParts = splittedScope.slice(0, splittedScope.length - 2);
        const scopeKey = scopeKeyParts.join(':');

        if (!groupedScopes[scopeKey]) {
          groupedScopes[scopeKey] = [scope];
          return;
        }

        groupedScopes[scopeKey].push(scope);
      });

      return groupedScopes;
    },
  },

  methods: {
    onSubmit() {
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
  border-bottom: 1px solid var(--endpass-ui-color-grey-1);
}
</style>

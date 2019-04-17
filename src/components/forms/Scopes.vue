<template>
  <form @submit.prevent="handleSubmit">
    <form-field>
      <message>
        Application requests following scopes. Press "Allow" button to grant
        these permissions.
      </message>
    </form-field>
    <form-field v-for="scope in scopes" :key="scope">
      <v-checkbox
        :checked="isScopeChecked(scope)"
        @input="handleScopeChange(scope, $event)"
      >
        {{ scope }}
      </v-checkbox>
    </form-field>
    <form-controls>
      <v-button
        :disabled="!isFormValid || loading"
        :submit="true"
        :fluid="true"
        type="primary"
        data-test="submit-button"
        >{{ primaryButtonLabel }}</v-button
      >
    </form-controls>
  </form>
</template>

<script>
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import xor from 'lodash/xor';
import VCheckbox from '@endpass/ui/components/VCheckbox';
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';

export default {
  name: 'ScopesForm',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    scopes: {
      type: Array,
      default: () => [],
    },
  },

  data: () => ({
    checkedScopes: [],
  }),

  computed: {
    primaryButtonLabel() {
      return !this.loading ? 'Allow' : 'Loading...';
    },

    isFormValid() {
      return xor(this.scopes, this.checkedScopes).length === 0;
    },
  },

  methods: {
    handleSubmit() {
      if (!this.isFormValid) return;

      this.$emit('submit', this.checkedScopes);
    },

    isScopeChecked(scope) {
      return this.checkedScopes.includes(scope);
    },

    handleScopeChange(scope, value) {
      if (value) {
        this.checkedScopes = uniq(this.checkedScopes.concat(scope));
      } else {
        this.checkedScopes = without(this.checkedScopes, scope);
      }
    },
  },

  components: {
    VButton,
    VCheckbox,
    Message,
    FormField,
    FormControls,
  },
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <form-field>
      <message>
        Application requests following scopes. Press "Allow" button to grant
        these permissions.
      </message>
    </form-field>
    <form-field>
      <scopes-checkbox-tree
        v-for="level in scopesTree"
        :key="level.key"
        :level="level"
        :children="level.children"
        :values-map="valuesScopesMap"
        @change="onChange"
      />
    </form-field>
    <form-controls>
      <v-button
        :disabled="!isFormValid || isLoading"
        :submit="true"
        :fluid="true"
        type="primary"
        data-test="submit-button"
      >
        {{ primaryButtonLabel }}
      </v-button>
    </form-controls>
  </form>
</template>

<script>
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormField from '@/components/common/FormField.vue';
import FormControls from '@/components/common/FormControls.vue';
import ScopesCheckboxTree from '@/components/common/ScopesCheckboxTree';
import scopeTitlesMap from './scopeTitlesMap';

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

  data: () => ({
    valuesScopesMap: {},
    scopesTree: {},
    isFormValid: true,
  }),

  computed: {
    primaryButtonLabel() {
      return !this.isLoading ? 'Allow' : 'Loading...';
    },
  },

  watch: {
    scopesList: {
      handler(scopesList) {
        const tree = scopesList.reduce((map, key) => {
          const parentKey = key.split(':').shift();
          const parent = map[parentKey] || this.createTreeLevel(parentKey);

          Object.assign(map, { [parentKey]: parent });

          if (parentKey !== key) {
            parent.children[key] = this.createTreeLevel(key);
          }

          return map;
        }, {});

        this.valuesScopesMap = Object.keys(tree)
          .concat(scopesList)
          .reduce(
            (acc, key) =>
              Object.assign(acc, {
                [key]: true,
              }),
            {},
          );
        this.scopesTree = tree;
      },
      immediate: true,
    },

    valuesScopesMap: {
      handler() {
        const res = this.getCheckedScopes();
        this.isFormValid = res.length !== 0;
      },
      immediate: true,
    },
  },

  methods: {
    createTreeLevel(key) {
      return {
        key,
        title: scopeTitlesMap[key] || '',
        children: {},
      };
    },

    onChange(newValues) {
      this.valuesScopesMap = { ...this.valuesScopesMap, ...newValues };
    },

    handleSubmit() {
      if (!this.isFormValid) return;

      const res = this.getCheckedScopes();

      this.$emit('submit', res);
    },

    getCheckedScopes() {
      const res = this.scopesList.filter(
        key => this.valuesScopesMap[key] === true,
      );

      return res;
    },
  },

  components: {
    ScopesCheckboxTree,
    VButton,
    Message,
    FormField,
    FormControls,
  },
};
</script>

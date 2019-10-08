<template>
  <form @submit.prevent="handleSubmit">
    <form-field>
      <v-description>
        {{ $t('components.scopes.allowScopes') }}
      </v-description>
    </form-field>
    <div class="form-field v-mb-24">
      <scopes-checkbox-tree
        v-for="level in scopesTree"
        :key="level.key"
        :level="level"
        :children="level.children"
        :values-map="valuesScopesMap"
        data-test="scopes-tree"
        @change="onChange"
      />
    </div>
    <form-controls>
      <v-button
        v-if="isPopup"
        type="button"
        :disabled="isLoading"
        :fluid="true"
        skin="quaternary"
        data-test="cancel-button"
        @click="handleCancel"
      >
        {{ $t('global.deny') }}
      </v-button>
      <v-button
        :disabled="!isFormValid || isLoading"
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
import ScopesCheckboxTree from '@/components/common/ScopesCheckboxTree';
import scopeTitlesMap from './scopeTitlesMap';
import VDescription from '@/components/common/VDescription';

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
    isPopup() {
      return !!window.opener;
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
    handleCancel() {
      this.$emit('cancel');
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
    FormField,
    FormControls,
    VDescription,
  },
};
</script>

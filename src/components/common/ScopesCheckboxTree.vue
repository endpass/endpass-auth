<template>
  <ul :class="{ 'scopes-checkbox-tree': true, child: isChild }">
    <li class="scopes-checkbox-tree-item">
      <v-checkbox
        v-if="level.title"
        :model-value="valuesMap[level.key]"
        type="checkbox"
        @change="onChange(level, $event)"
      >
        {{ level.title }}
      </v-checkbox>
      <scopes-checkbox-tree
        v-for="childLevel in children"
        :key="childLevel.key"
        :level="childLevel"
        :children="childLevel.children"
        :values-map="valuesMap"
        :is-child="true"
        @change="onChangeLevel"
      />
    </li>
  </ul>
</template>

<script>
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import VCheckbox from '@endpass/ui/kit/VCheckbox';

const ScopesCheckboxTree = {
  name: 'ScopesCheckboxTree',

  props: {
    children: {
      type: Object,
      default: () => ({}),
    },

    valuesMap: {
      type: Object,
      default: () => ({}),
    },

    level: {
      type: Object,
      default: () => ({}),
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    isChild: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    checkedScopes: [],
  }),

  methods: {
    onChange(scope, value) {
      if (this.disabled) return;

      const newValuesMap = { ...this.valuesMap };

      Object.keys(newValuesMap).forEach(key => {
        if (key.indexOf(scope.key) === 0) {
          newValuesMap[key] = value;
        }
      });

      const [rootLevel] = scope.key.split(':');
      const levelScopes = pickBy(
        newValuesMap,
        (_, key) => key !== rootLevel && key.indexOf(rootLevel) === 0,
      );
      const isLevelChecked = isEmpty(pickBy(levelScopes, val => !val));

      if (scope.key !== rootLevel) {
        newValuesMap[rootLevel] = isLevelChecked;
      }

      this.$emit('change', newValuesMap);
    },

    onChangeLevel(valuesMap) {
      if (this.disabled) return;

      this.$emit('change', valuesMap);
    },
  },

  components: {
    VCheckbox,
  },
};

export default ScopesCheckboxTree;
</script>

<style lang="postcss">
.scopes-checkbox-tree {
  &.child {
    margin: 10px 0 10px 23px;
  }
}
</style>

<template>
  <div>
    <label class="checkbox">
      <input
        v-if="level.title"
        :checked="valuesMap[level.key]"
        type="checkbox"
        @input="onChange(level, $event)"
      />
      {{ level.title }}
    </label>

    <scopes-checkbox-tree
      v-for="childLevel in children"
      :key="childLevel.key"
      :level="childLevel"
      :children="childLevel.children"
      :values-map="valuesMap"
      :class="{
        'scope-level': true,
        'scope-level_is-child': true,
      }"
      @change="onChangeLevel"
    />
  </div>
</template>

<script>
const ScopesCheckboxTree = {
  name: 'ScopesCheckboxTree',

  props: {
    children: {
      type: Object,
      default: () => {
        return {};
      },
    },
    valuesMap: {
      type: Object,
      default: () => {
        return {};
      },
    },
    level: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data: () => ({
    checkedScopes: [],
  }),

  methods: {
    onChange(scope, ev) {
      const value = ev.target.checked;

      const valuesMap = Object.keys(this.valuesMap)
        .filter(key => key.indexOf(scope.key) === 0) // find all deep children with current level
        .reduce(
          (map, key) => {
            map[key] = value;
            return map;
          },
          { ...this.valuesMap },
        );

      this.$emit('change', valuesMap);
    },

    onChangeLevel(valuesMap) {
      const childrenKeys = Object.keys(this.level.children);

      const isLevelChecked = !childrenKeys
        .map(key => valuesMap[key])
        .includes(false);

      const newValueMap = {
        ...valuesMap,
        [this.level.key]: isLevelChecked,
      };

      this.$emit('change', newValueMap);
    },
  },
};

export default ScopesCheckboxTree;
</script>

<style lang="postcss">
.scope-level_is-child {
  margin-left: 20px;
}
</style>

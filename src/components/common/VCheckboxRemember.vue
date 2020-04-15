<template>
  <v-checkbox
    :model-value="value"
    @change="onChange"
  >
    {{ $t('components.rememberCheckbox.rememberMe') }}
  </v-checkbox>
</template>

<script>
import VCheckbox from '@endpass/ui/kit/VCheckbox';

export default {
  name: 'VCheckboxRemember',

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    onChange(value) {
      this.$emit('input', value);
    },
  },

  components: {
    VCheckbox,
  },

  model: {
    event: 'input',
    prop: 'value',
  },
};
</script>

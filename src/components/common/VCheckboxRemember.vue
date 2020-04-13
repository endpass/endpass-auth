<template>
  <v-checkbox v-model="value">
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
      default: false,
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

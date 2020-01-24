<template>
  <v-checkbox
    v-bind="$attrs"
    type="checkbox"
    v-on="$listeners"
  >
    {{ $t('components.rememberCheckbox.text') }}
  </v-checkbox>
</template>

<script>
import VCheckbox from '@endpass/ui/kit/VCheckbox';

export default {
  name: 'RememberCheckbox',

  components: {
    VCheckbox,
  },

  model: {
    prop: 'value',
    event: 'change',
  },
};
</script>

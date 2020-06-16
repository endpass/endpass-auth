<template>
  <v-circle-button @click="onRecord">
    <v-svg-icon
      width="24px"
      height="24px"
      name="media-recorder"
    />
  </v-circle-button>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import VCircleButton from '../VCircleButton';

export default {
  name: 'MediaRecordView',

  props: {},

  methods: {
    onRecord() {
      this.$emit('record');
    },
  },

  components: {
    VCircleButton,
    VSvgIcon,
  },
};
</script>

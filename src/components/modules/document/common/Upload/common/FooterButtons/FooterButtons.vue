<template>
  <form-controls>
    <left-button
      v-bind="$attrs"
      v-on="$listeners"
    />
    <right-button
      v-bind="$attrs"
      v-on="$listeners"
    />
  </form-controls>
</template>

<script>
import FormControls from '@/components/common/FormControls';
import LeftButton from './LeftButton';
import RightButton from './RightButton';

export default {
  name: 'FooterButtons',
  components: {
    FormControls,
    LeftButton,
    RightButton,
  },
};
</script>

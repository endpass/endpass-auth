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
import LeftButton from './LeftButton';
import RightButton from './RightButton';
import FormControls from '@/components/common/FormControls';

export default {
  name: 'FooterButtons',
  components: {
    FormControls,
    LeftButton,
    RightButton,
  },
};
</script>

<template>
  <form-controls>
    <button-cancel
      v-bind="$attrs"
      v-on="$listeners"
    />
    <button-repeat-recognize
      v-bind="$attrs"
      v-on="$listeners"
    />
  </form-controls>
</template>

<script>
import FormControls from '@/components/common/FormControls';
import ButtonCancel from './LeftButton/ButtonCancel';
import ButtonRepeatRecognize from './RightButton/ButtonRepeatRecognize';

export default {
  name: 'FooterRepeatButtons',
  components: {
    ButtonRepeatRecognize,
    ButtonCancel,
    FormControls,
  },
};
</script>

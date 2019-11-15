<template>
  <form-controls>
    <button-cancel
      v-bind="$attrs"
      v-on="$listeners"
    />
    <button-upload
      v-bind="$attrs"
      v-on="$listeners"
    />
  </form-controls>
</template>

<script>
import FormControls from '@/components/common/FormControls';
import ButtonCancel from './LeftButton/ButtonCancel';
import ButtonUpload from './RightButton/ButtonUpload';

export default {
  name: 'FooterFrontButtons',
  components: {
    ButtonUpload,
    ButtonCancel,
    FormControls,
  },
};
</script>

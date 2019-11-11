<template>
  <form-controls>
    <button-done
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
import ButtonUpload from './RightButton/ButtonUpload';
import ButtonDone from './LeftButton/ButtonDone';

export default {
  name: 'FooterDoneButtons',
  components: {
    ButtonDone,
    ButtonUpload,
    FormControls,
  },
};
</script>

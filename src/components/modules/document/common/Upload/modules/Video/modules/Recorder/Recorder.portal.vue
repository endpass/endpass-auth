<template>
  <portal to="portal">
    <recorder />
  </portal>
</template>

<script>
import Recorder from './Recorder.interface';

export default {
  name: 'RecorderPortal',

  components: {
    Recorder,
  },
};
</script>

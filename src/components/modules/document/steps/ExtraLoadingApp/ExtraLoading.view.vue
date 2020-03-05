<template>
  <div>
    <v-title>
      {{ $t('components.uploadDocument.loading') }}
    </v-title>
    <v-description>
      {{ $t('components.uploadDocument.pleaseWait') }}
    </v-description>
    <div class="extra-loading-progress">
      <v-progress-circle
        :progress="progress"
        :is-label-visible="true"
      />
    </div>
    <count-down-timer
      :timeout="timeout"
      :is-locked.sync="isLocked"
      :counter.sync="counter"
    />
  </div>
</template>

<script>
import VProgressCircle from '@endpass/ui/kit/VProgressCircle';
import VTitle from '@/components/common/VTitle';
import VDescription from '@/components/common/VDescription';
import CountDownTimer from '@/components/common/CountDownTimer';

export default {
  name: 'ExtraLoadingView',

  data() {
    return {
      isLocked: false,
      counter: 0,
      timeout: 2000,
    };
  },

  computed: {
    progress() {
      const timeoutInSec = this.timeout / 1000;
      const percent = Math.floor((this.counter * 100) / timeoutInSec);
      return 100 - percent;
    },
  },

  watch: {
    isLocked(newValue) {
      if (!newValue) {
        this.$emit('done');
      }
    },
  },

  mounted() {
    this.isLocked = true;
  },

  components: {
    CountDownTimer,
    VTitle,
    VDescription,
    VProgressCircle,
  },
};
</script>
<style scoped lang="postcss">
.extra-loading-progress {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>

<template>
  <div class="media-record-done">
    <div class="media-record-done-left-place">
      <div>
        <v-button
          is-inline
          @click="onRetake"
        >
          retake
        </v-button>
      </div>
    </div>
    <slot />
    <div class="media-record-done-right-place">
      <div>
        <v-button
          is-inline
          @click="onConfirm"
        >
          continue
        </v-button>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';

export default {
  name: 'MediaRecordDoneView',

  methods: {
    onRetake() {
      this.$emit('retake');
    },

    onConfirm() {
      this.$emit('confirm');
    },
  },

  components: {
    VButton,
  },
};
</script>

<style lang="postcss">
.media-record-done {
  display: flex;
  width: 100%;
}

.media-record-done-left-place {
  display: flex;
  align-items: center;
  margin-right: auto;
  flex: 1;
}

.media-record-done-right-place {
  display: flex;
  align-items: center;
  margin-left: auto;
  flex: 1;
  justify-content: flex-end;
}
</style>

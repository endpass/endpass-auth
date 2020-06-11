<template>
  <full-screen>
    <div class="recorder-view">
      <div>
        <button
          class="recorder-view-button-back"
          @click="onBack"
        >
          <v-svg-icon
            name="arrow-left"
            width="23px"
            height="17px"
          />
        </button>
      </div>
      <div>
        container record
      </div>
      <div>
        buttons
      </div>
    </div>
  </full-screen>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import FullScreen from '@/components/modules/FullScreen';

export default {
  name: 'RecorderView',

  props: {},

  methods: {
    onBack() {
      this.$emit('cancel');
    },
  },

  components: {
    FullScreen,
    VSvgIcon,
  },
};
</script>

<style lang="postcss">
.recorder-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.recorder-view-button-back,
.recorder-view-button-close {
  color: var(--endpass-ui-color-grey-5);
  background: none;
  border: 0;
  cursor: pointer;
  display: flex;
  padding: 0;
  outline: 0;
  user-select: none;
}
</style>

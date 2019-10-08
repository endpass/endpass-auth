<template>
  <div class="frame">
    <v-modal-card
      class="frame-modal-card"
      :is-closable="isClosable"
      @close="emitClose"
    >
      <template
        v-if="title"
        slot="title"
        name="title"
      >
        {{ title }}
      </template>
      <spinner
        v-if="isLoading"
        class="frame-spinner"
      />
      <slot v-else />
    </v-modal-card>
  </div>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Spinner from '@/components/common/Spinner';

export default {
  name: 'VFrame',

  props: {
    title: {
      type: String,
      default: 'Connect',
    },
    isClosable: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    emitClose() {
      this.$emit('close');
    },
  },

  components: {
    Spinner,
    VModalCard,
  },
};
</script>

<style lang="postcss">
@keyframes slideIn {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
}

.frame {
  overflow: hidden;
  max-width: 360px;
  margin: 50px auto;
  border-radius: 4px;
  box-shadow: 0 5px 10px 1px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  animation: slideIn 0.75s;
}

.frame-modal-card {
  max-width: initial !important;
}

.frame-spinner {
  position: relative;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .frame {
    max-width: initial;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    animation: none;
  }
}
</style>

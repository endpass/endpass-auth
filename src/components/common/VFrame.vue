<template>
  <div class="frame">
    <v-modal-card
      class="frame-modal-card"
      :is-closable="isClosable"
      :is-returnable="isReturnable"
      @return="onReturn"
      @close="onClose"
    >
      <div
        v-if="isShowLogo"
        slot="icon"
        data-test="logo"
        class="frame-logo"
      >
        <img
          src="../../assets/logo.png"
          alt="Endpass Inc. - Logotype"
        >
      </div>
      <template
        v-if="title"
        slot="title"
        name="title"
      >
        {{ title }}
      </template>
      <slot />
    </v-modal-card>
    <v-footer class="frame-footer" />
  </div>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import VFooter from '@/components/modules/VFooter';

export default {
  name: 'VFrame',

  props: {
    title: {
      type: String,
      default: 'Connect',
    },

    isShowLogo: {
      type: Boolean,
      default: false,
    },

    isClosable: {
      type: Boolean,
      default: true,
    },

    isReturnable: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClose() {
      this.$emit('close');
    },

    onReturn() {
      this.$emit('return');
    },
  },

  components: {
    VModalCard,
    VFooter,
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

.frame-logo {
  width: 100%;
  text-align: left;
}

.frame-logo img {
  width: 112px;
  height: 32px;
}

.frame-modal-card {
  max-width: initial !important;
  margin-bottom: 92px;
}
.frame-footer {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  right: 0;
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

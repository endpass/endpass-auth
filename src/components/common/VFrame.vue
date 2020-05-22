<template>
  <div class="v-frame">
    <v-modal-card
      class="v-frame-modal-card"
      :is-closable="isClosable"
      :is-returnable="isReturnable"
      @return="onReturn"
      @close="onClose"
    >
      <div
        v-if="showLogo"
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
    <Footer />
  </div>
</template>

<script>
import VModalCard from '@endpass/ui/kit/VModalCard';
import Footer from '@/components/modules/Footer';

export default {
  name: 'VFrame',

  props: {
    title: {
      type: String,
      default: 'Connect',
    },

    showLogo: {
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
    Footer,
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

.v-frame {
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

.v-frame-modal-card {
  max-width: initial !important;
}

@media (max-width: 768px) {
  .v-frame {
    max-width: initial;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    animation: none;
  }
}
</style>

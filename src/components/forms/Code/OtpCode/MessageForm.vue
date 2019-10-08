<template>
  <div>
    <form-item class="v-mb-24">
      <message data-test="form-message">
        {{ message }}
      </message>
    </form-item>
    <v-button
      :disabled="!isClosable"
      data-test="cancel-button"
      @click="emitCancel"
    >
      {{ $t('global.close') }}
    </v-button>
  </div>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import Message from '@/components/common/Message.vue';
import FormItem from '@/components/common/FormItem';

export default {
  name: 'MessageForm',

  props: {
    message: {
      type: String,
      required: true,
    },

    isClosable: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    emitCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    VButton,
    Message,
    FormItem,
  },
};
</script>

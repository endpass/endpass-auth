<template>
  <div>
    <message>
      You have not any account. Create one and you will be logged in.
    </message>
    <form-controls>
      <v-button
        type="primary"
        data-test="submit-button"
        @click="emitRequest"
      >
        Create account
      </v-button>
    </form-controls>
  </div>
</template>

<script>
import VButton from '@/components/common/VButton.vue';
import Message from '@/components/common/Message.vue';
import FormControls from '@/components/common/FormControls.vue';

export default {
  name: 'CreateAccountForm',

  data: () => ({
    email: '',
  }),

  methods: {
    emitRequest() {
      this.$emit('request');
    },
  },

  components: {
    VButton,
    Message,
    FormControls,
  },
};
</script>

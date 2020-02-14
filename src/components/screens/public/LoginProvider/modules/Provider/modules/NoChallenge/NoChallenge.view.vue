<template>
  <message
    :error="true"
    data-test="error-message"
  >
    {{ $t('components.loginProviderPassword.loginChallenge') }}
  </message>
</template>

<script>
import Message from '@/components/common/Message';

export default {
  name: 'NoChallenge',

  components: {
    Message,
  },
};
</script>

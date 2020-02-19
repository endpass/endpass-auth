<template>
  <error :error="$t('components.loginProviderPassword.loginChallenge')" />
</template>

<script>
import Error from '@/components/modules/Error';

export default {
  name: 'NoChallengeView',

  components: {
    Error,
  },
};
</script>

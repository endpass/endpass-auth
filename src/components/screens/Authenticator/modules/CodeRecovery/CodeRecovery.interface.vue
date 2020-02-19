<template>
  <code-recovery
    :email="email"
    @recovered="onRecovered"
    @recovery-cancel="onCancel"
  />
</template>

<script>
import CodeRecovery from '@/components/modules/CodeRecovery';

export default {
  name: 'AuthCodeRecovery',

  props: {
    email: {
      type: String,
      default: '',
    },
  },

  methods: {
    onRecovered() {
      this.$emit('complete');
    },

    onCancel() {
      this.$emit('switch', { to: 'app-code' });
    },
  },

  components: {
    CodeRecovery,
  },
};
</script>

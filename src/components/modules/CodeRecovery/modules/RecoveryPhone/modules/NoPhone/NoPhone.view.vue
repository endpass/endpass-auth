<template>
  <form
    data-test="phone-not-exist"
    @submit.prevent="onCancel"
  >
    <v-title>
      {{ $t('components.recoverOtpSms.titlePhoneNotExist') }}
    </v-title>

    <form-item class="v-mb-24">
      <v-button
        :is-loading="isLoading"
        type="submit"
        data-test="submit-button"
      >
        {{ $t('global.cancel') }}
      </v-button>
    </form-item>
  </form>
</template>

<script>
import VButton from '@endpass/ui/kit/VButton';
import FormItem from '@/components/common/FormItem';
import formMixin from '@/mixins/form';
import VTitle from '@/components/common/VTitle';

export default {
  name: 'NoPhone',

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },
  },

  mixins: [formMixin],

  components: {
    VTitle,
    VButton,
    FormItem,
  },
};
</script>

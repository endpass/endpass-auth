<template>
  <v-modal-card
    data-test="document-create-modal"
    :is-closable="false"
  >
    <template slot="title">
      {{ $t('components.uploadDocument.uploadDocument') }}
    </template>
    <form-item>
      <v-select
        :value.sync="documentType"
        :options="$options.documentTypes"
        :label="$t('components.uploadDocument.documentType')"
        :disabled="!isDocTypeMutable"
      />
    </form-item>
    <sides
      :document-type="documentType"
      v-on="$listeners"
      @toggle="onToggle"
    />
  </v-modal-card>
</template>

<script>
import VSelect from '@endpass/ui/kit/VSelect';
import VModalCard from '@endpass/ui/kit/VModalCard';
import FormItem from '@/components/common/FormItem';
import { DOC_TYPES } from '@/constants';
import { CONSTANT_TRANSLATES } from '@/constants/translates';
import Sides from './Sides/Sides';

export default {
  name: 'DocumentUpload',

  data: () => ({
    documentType: DOC_TYPES.PASSPORT,
    isDocTypeMutable: true,
  }),

  documentTypes: [
    {
      text: CONSTANT_TRANSLATES[DOC_TYPES.PASSPORT],
      val: DOC_TYPES.PASSPORT,
    },
    {
      text: CONSTANT_TRANSLATES[DOC_TYPES.DRIVER_LICENSE],
      val: DOC_TYPES.DRIVER_LICENSE,
    },
  ],

  methods: {
    onToggle() {
      this.isDocTypeMutable = false;
    },
  },

  components: {
    Sides,
    VSelect,
    FormItem,
    VModalCard,
  },
};
</script>

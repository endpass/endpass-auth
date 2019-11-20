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
        v-model="documentType"
        :options="$options.documentTypes"
        :label="$t('components.uploadDocument.documentType')"
        :disabled="!isDocTypeMutable"
        data-test="document-type"
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
import get from 'lodash/get';
import VSelect from '@endpass/ui/kit/VSelect';
import VModalCard from '@endpass/ui/kit/VModalCard';
import FormItem from '@/components/common/FormItem';
import { DOC_TYPES } from '@/constants';
import { CONSTANT_TRANSLATES } from '@/constants/translates';
import Sides from './Sides/Sides';
import { sharedStore } from '@/store';

const DEFAULT_DOC_TYPE = DOC_TYPES.PASSPORT;

const createDocTypeOption = val => ({
  text: CONSTANT_TRANSLATES[val],
  val,
});

export default {
  name: 'DocumentUpload',

  sharedStore,

  data: () => ({
    documentType: DEFAULT_DOC_TYPE,
    isDocTypeMutable: true,
  }),

  documentTypes: [
    createDocTypeOption(DOC_TYPES.PASSPORT),
    createDocTypeOption(DOC_TYPES.DRIVER_LICENSE),
    createDocTypeOption(DOC_TYPES.PROOF_OF_ADDRESS),
    createDocTypeOption(DOC_TYPES.ID_CARD),
  ],

  methods: {
    onToggle() {
      this.isDocTypeMutable = false;
    },
  },

  created() {
    this.documentType = get(
      this.$options.sharedStore.documentUploadOptions,
      'defaultDocumentType',
      DEFAULT_DOC_TYPE,
    );
  },

  components: {
    Sides,
    VSelect,
    FormItem,
    VModalCard,
  },
};
</script>

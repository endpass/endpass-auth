<template>
  <doc-layout :is-closable="false">
    <component
      :is="currentComponent"
      :doc-types-list="docTypesList"
      :document-id="mutables.documentId"
      :selected-document-type="selectedDocumentType"
      @complete="onCompete"
      @create="onCreate"
      @cancel="onCancel"
    />
  </doc-layout>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';
import { DOC_STATUSES } from '@/constants';

import ExtraLoadingDocument from '@/components/modules/document/steps/ExtraLoadingDocument';
import Success from '@/components/modules/document/steps/Success';
import Upload from '@/components/modules/document/steps/Upload';
import RequestedInfo from '@/components/modules/document/steps/RequestedInfo';

export default {
  name: 'DocSpecifiedContainer',

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      mutables: {
        status: '',
        documentId: '',
        selectedDocumentType: '',
      },
    };
  },

  computed: {
    currentComponent() {
      if (!this.mutables.selectedDocumentType) {
        return RequestedInfo;
      }

      if (this.mutables.status === DOC_STATUSES.VERIFIED) {
        return Success;
      }

      if (this.mutables.status === DOC_STATUSES.PENDING_REVIEW) {
        return ExtraLoadingDocument;
      }

      return Upload;
    },
  },

  methods: {
    onCreate({ documentId }) {
      this.$emit('create', { documentId });
    },

    onCompete(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(fieldKey => {
        if (Object.getOwnPropertyDescriptor(this.mutables, fieldKey)) {
          this.mutables[fieldKey] = payload[fieldKey];
        }
      });
    },

    onCancel() {
      this.$emit('cancel');
    },
  },

  components: {
    DocLayout,
  },
};
</script>

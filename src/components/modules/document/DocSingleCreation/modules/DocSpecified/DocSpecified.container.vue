<template>
  <doc-layout
    :is-closable="isClosable"
    @close="onClose"
  >
    specified
    <component
      :is="currentComponent"
      :doc-types-list="docTypesList"
      :document-id="documentId"
      :selected-document-type="selectedDocumentType"
      :is-show-status="false"
      @next="onNext"
      @create="onCreate"
      @cancel="onCancel"
    />
  </doc-layout>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';
import { DOC_STATUSES } from '@/constants';

import ExtraLoading from '@/components/modules/document/steps/extraLoading/ModeDocument';
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

    selectedDocumentType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    documentId: {
      type: String,
      required: true,
    },
  },

  computed: {
    isClosable() {
      return !this.documentId && !this.status;
    },

    currentComponent() {
      if (!this.documentId && !this.selectedDocumentType) {
        return RequestedInfo;
      }

      if (this.status === DOC_STATUSES.VERIFIED) {
        return Success;
      }

      if (this.status) {
        return ExtraLoading;
      }

      return Upload;
    },
  },

  methods: {
    onCreate() {
      this.$emit('create');
    },

    onNext(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    onCancel() {
      this.$emit('cancel');
    },

    onClose() {
      this.$emit('close');
    },
  },

  components: {
    DocLayout,
  },
};
</script>

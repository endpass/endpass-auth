<template>
  <doc-layout
    :is-closable="false"
    @close="onClose"
  >
    selected
    <component
      :is="currentComponent"
      :doc-types-list="docTypesList"
      :document-id="documentId"
      :selected-document-type="selectedDocumentType"
      :is-show-status="false"
      @next="onNext"
      @create="onCreate"
    />
  </doc-layout>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';
import { DOC_STATUSES } from '@/constants';

import ExtraLoadingDocument from '@/components/modules/document/steps/extraLoading/ModeDocument';
import Success from '@/components/modules/document/steps/Success';
import Upload from '@/components/modules/document/steps/Upload';

export default {
  name: 'DocSelectedContainer',

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
    currentComponent() {
      if (this.status === DOC_STATUSES.VERIFIED) {
        return Success;
      }

      if (this.status) {
        return ExtraLoadingDocument;
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

    onClose() {
      this.$emit('close');
    },
  },

  components: {
    DocLayout,
  },
};
</script>

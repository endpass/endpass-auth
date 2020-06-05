<template>
  <component
    :is="currentComponent"
    :doc-types-list="docTypesList"
    :document-id="documentId"
    :status="status"
    :selected-document-type="selectedDocumentType"
    @next="onNext"
    @create="onCreate"
    @cancel="onBack"
  >
    <slot />
  </component>
</template>

<script>
import Vue from 'vue';

import UploadStatus from '../UploadStatus';
import UploadSingle from '../UploadSingle';
import DocTypesList from './modules/DocTypesList';

export default {
  name: 'DocSpecifiedContainer',

  props: {
    bus: {
      type: Vue,
      default: () => new Vue(),
    },

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
      switch (true) {
        case !this.documentId && !this.selectedDocumentType:
          return DocTypesList;

        case !!this.status:
          return UploadStatus;

        default:
          return UploadSingle;
      }
    },
  },

  watch: {
    currentComponent(newComponent) {
      switch (newComponent) {
        case DocTypesList:
          this.$emit('update', { isBack: false });
          break;
        case UploadStatus:
          this.$emit('update', { isBack: false });
          break;
        case UploadSingle:
          this.$emit('update', { isBack: true });
          break;

        default:
          break;
      }
    },
  },

  methods: {
    onCreate() {
      this.$emit('create', { documentId: this.documentId });
    },

    onNext(payload) {
      this.$emit('update', payload);
    },

    onBack() {
      this.$emit('update', { selectedDocumentType: '' });
    },
  },

  created() {
    this.bus.$on('return', this.onBack);
  },
};
</script>

<template>
  <loading-screen :is-loading="isLoading">
    <doc-layout
      :is-closable="isClosable"
      @close="onCancel"
    >
      <component
        :is="currentComponent"
        :doc-type-to-status="docTypeToStatus"
        :doc-types-list="docTypesList"
        :is-show-status="true"
        @next="onNext"
        @create="onCreate"
        @cancel="onBack"
      />
    </doc-layout>
  </loading-screen>
</template>

<script>
import DocLayout from '@/components/modules/document/DocLayout';
// import { DOC_STATUSES } from '@/constants';

// import ModeApp from '@/components/modules/document/steps/extraLoading/ModeApp';
// import Success from '@/components/modules/document/steps/Success';
import Upload from '@/components/modules/document/steps/Upload';
import DocumentTypes from '@/components/modules/document/steps/DocumentTypes';
import LoadingScreen from '@/components/common/LoadingScreen';

export default {
  name: 'DocRequiredCreationContainer',

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    docTypesList: {
      type: Array,
      required: true,
    },

    docTypeToStatus: {
      type: Object,
      required: true,
    },

    documentsList: {
      type: Array,
      required: true,
    },

    isRequiredVerified: {
      type: Boolean,
      required: true,
    },

    isHaveBad: {
      type: Boolean,
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

  data: () => ({
    currentComponent: DocumentTypes,
  }),

  computed: {
    isClosable() {
      return !this.documentId && !this.status;
    },
  },

  methods: {
    onCancel() {
      this.$emit('cancel');
    },

    onCreate() {
      this.$emit('create');
    },

    updateProps(payload) {
      if (!payload) return;

      Object.keys(payload).forEach(propName => {
        this.$emit(`update:${propName}`, payload[propName]);
      });
    },

    async onNext(payload) {
      this.updateProps(payload);

      await this.$nextTick();

      this.nextScreen();
    },

    nextScreen() {
      switch (true) {
        case this.currentComponent === DocumentTypes &&
          this.selectedDocumentType:
          this.currentComponent = Upload;
          break;

        default:
          throw new Error(
            'Wrong state case with document required types upload',
          );
      }
    },

    onBack() {},
  },

  components: {
    LoadingScreen,
    DocLayout,
  },
};
</script>

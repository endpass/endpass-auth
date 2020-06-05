<template>
  <doc-specified-state
    #default="{ isClosable, isBack, status, documentId, selectedDocumentType, updateState }"
  >
    <doc-specified-interactor #default="{ onCancel, onCreate }">
      <doc-layout
        :is-closable="isClosable"
        :is-returnable="isBack"
        @close="onCancel"
        @return="onReturn"
      >
        <doc-specified-container
          :bus="bus"
          :doc-types-list="docTypesList"
          :status="status"
          :document-id="documentId"
          :selected-document-type="selectedDocumentType"
          @update="updateState"
          @create="onCreate"
        />
      </doc-layout>
    </doc-specified-interactor>
  </doc-specified-state>
</template>

<script>
import Vue from 'vue';
import DocLayout from '@/components/modules/document/DocLayout';

import DocSpecifiedInteractor from './DocSpecified.interactor';
import DocSpecifiedState from './DocSpecified.state';
import DocSpecifiedContainer from './DocSpecified.container';
import createDocSingleController from '../controllers/DocumentSingleController';

export default {
  name: 'DocSpecifiedInterface',

  docSingleController: createDocSingleController(),

  provide() {
    const { docSingleController } = this.$options;
    return {
      gateway: {
        async finishCreate({ documentId }) {
          await docSingleController.finishCreate({ documentId });
        },

        async cancelCreate() {
          await docSingleController.cancelCreate();
        },
      },
    };
  },

  props: {
    docTypesList: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    bus: new Vue(),
  }),

  methods: {
    onReturn() {
      this.bus.$emit('return');
    },
  },

  components: {
    DocLayout,
    DocSpecifiedContainer,
    DocSpecifiedState,
    DocSpecifiedInteractor,
  },
};
</script>

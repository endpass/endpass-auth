<template>
  <doc-specified-state
    #default="{ status, documentId, selectedDocumentType, updateState }"
  >
    <doc-specified-interactor #default="{ onCancel, onCreate }">
      <doc-specified-container
        :doc-types-list="docTypesList"
        :status="status"
        :document-id="documentId"
        :selected-document-type="selectedDocumentType"
        @update="updateState"
        @cancel="onCancel"
        @create="onCreate"
      />
    </doc-specified-interactor>
  </doc-specified-state>
</template>

<script>
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

  components: {
    DocSpecifiedContainer,
    DocSpecifiedState,
    DocSpecifiedInteractor,
  },
};
</script>

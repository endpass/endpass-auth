<template>
  <loading-screen :is-loading="isLoading">
    <document-create
      :types="types"
      :is-extra-loading.sync="isExtraLoading"
      :document-type.sync="documentType"
      :type-to-status="typeToStatus"
      @create="onCreate"
      @cancel="onCancel"
      @close="onClose"
    />
  </loading-screen>
</template>

<script>
import DocumentCreate from '../DocLayout';
import createDocumentController from './DocumentRequiredController';
import LoadingScreen from '@/components/common/LoadingScreen';
import { DOC_STATUSES } from '@/constants';

const BAD_STATUSES = [
  DOC_STATUSES.RECOGNITION,
  DOC_STATUSES.DRAFT,
  DOC_STATUSES.NOT_READABLE,
  DOC_STATUSES.NOT_VERIFIED,
];

export default {
  name: 'CreateRequiredInteractor',

  createRequiredController: createDocumentController(),

  data() {
    return {
      types: [],
      typeToStatus: {},
      isLoading: true,
      isExtraLoading: false,
      documentType: '',
    };
  },

  computed: {
    isAllVerified() {
      const isVerified = this.types.every(type => {
        const status = this.typeToStatus[type];
        return status === DOC_STATUSES.VERIFIED;
      });

      return isVerified;
    },

    isHaveBad() {
      const res = Object.values(this.typeToStatus).every(
        status => !BAD_STATUSES.includes(status),
      );
      return res;
    },
  },

  watch: {
    isExtraLoading(newValue) {
      if (!newValue) {
        // what to do here?
      }
    },
  },

  methods: {
    onCancel() {
      this.documentType = '';
    },

    onClose() {
      this.$options.createRequiredController.cancelCreate();
    },

    async onCreate() {
      // check status for show extra loading and first screen again
      // this.$options.createRequiredController.finishCreate();
      await this.loadTypesAndSwitch();
    },

    handleFinish() {
      this.$options.createRequiredController.finishCreate();
    },

    async loadRequiredTypes() {
      try {
        this.isLoading = true;
        const {
          types,
          typeToStatus,
        } = await this.$options.createRequiredController.getRequiredTypes();
        this.types = types;
        this.typeToStatus = typeToStatus;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },

    switchScreen() {
      this.documentType = '';

      if (this.isAllVerified) {
        this.handleFinish();
        return;
      }

      if (!this.isHaveBad) {
        this.isExtraLoading = true;
      }
    },

    async loadTypesAndSwitch() {
      await this.loadRequiredTypes();

      this.switchScreen();
    },
  },

  async mounted() {
    await this.loadTypesAndSwitch();
  },

  components: {
    LoadingScreen,
    DocumentCreate,
  },
};
</script>

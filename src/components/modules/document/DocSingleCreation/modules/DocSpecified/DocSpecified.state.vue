<template>
  <div>
    <slot
      :status="status"
      :documentId="documentId"
      :isBack="isBack"
      :selectedDocumentType="selectedDocumentType"
      :isClosable="isClosable"
      :updateState="updateState"
    />
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';

export default {
  name: 'DocSpecifiedState',

  setup() {
    const data = {
      status: ref(''),
      documentId: ref(''),
      isBack: ref(false),
      selectedDocumentType: ref(''),
    };

    const isClosable = computed(
      () => !data.documentId.value || !data.status.value,
    );

    const updateState = payload => {
      if (!payload) return;
      Object.keys(payload).forEach(propName => {
        data[propName].value = payload[propName];
      });
    };

    return {
      ...data,
      isClosable,
      updateState,
    };
  },
};
</script>

<template>
  <div>
    <slot
      :selectedDocumentType="selectedDocumentType"
      :isReturnable="isReturnable"
      :updateState="updateState"
    />
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';

export default {
  name: 'DocRequiredCreationState',

  setup() {
    const data = {
      isReturnable: ref(false),
      selectedDocumentType: ref(''),
    };

    const updateState = payload => {
      if (!payload) return;
      Object.keys(payload).forEach(propName => {
        data[propName].value = payload[propName];
      });
    };

    return {
      ...data,
      updateState,
    };
  },
};
</script>

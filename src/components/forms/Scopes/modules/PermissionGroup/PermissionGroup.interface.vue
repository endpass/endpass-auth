<template>
  <permission-group
    :root-scope="rootScope"
    :scopes="scopes"
  />
</template>

<script>
import PermissionGroup from './PermissionGroup.view';

export default {
  name: 'PermissionGroupInterface',

  props: {
    rootScope: {
      type: String,
      required: true,
    },

    scopes: {
      type: Array,
      default: () => [],
    },
  },

  components: {
    PermissionGroup,
  },
};
</script>

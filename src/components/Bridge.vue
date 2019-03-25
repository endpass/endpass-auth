<template>
  <v-frame>
    <p>Endpass Auth bridge {{ version }}</p>
  </v-frame>
</template>

<script>
import pkg from '@/../package.json';
import VFrame from './VFrame.vue';

if (!ENV.notShowVersion) {
  console.info(
    `%cEndpass Auth Bridge (${pkg.version}) loaded 🔌`,
    'font-size: 14px; font-weight: bold',
  );
}

export default {
  name: 'Bridge',

  computed: {
    version() {
      return `v${pkg.version}`;
    },
  },

  components: {
    VFrame,
  },
};
</script>

<template>
  <div class="identicon">
    <img :src="image" :alt="address" :title="address" />
  </div>
</template>

<script>
import blockie from 'ethereum-blockies-base64';

export default {
  name: 'Identicon',

  props: {
    address: {
      type: String,
      required: true,
    },
  },

  computed: {
    image() {
      return blockie(this.address);
    },
  },
};
</script>

<style lang="postcss">
.identicon {
  display: flex;
  align-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e2e2e2;
  box-sizing: content-box;
}
</style>

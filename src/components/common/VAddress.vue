<template>
  <p class="address">
    <span class="address-identicon">
      <identicon :address="address" />
    </span>
    <message :ellipsis="true">
      {{ address }}
    </message>
  </p>
</template>

<script>
import Identicon from './Identicon.vue';
import Message from './Message.vue';

export default {
  name: 'VAddress',

  props: {
    address: {
      type: String,
      required: true,
    },
  },

  components: {
    Identicon,
    Message,
  },
};
</script>

<style lang="postcss">
.address {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.address-identicon {
  flex: 0 0 auto;
  margin-right: 10px;
}

.address-value {
  flex: 1 1 auto;
}
</style>

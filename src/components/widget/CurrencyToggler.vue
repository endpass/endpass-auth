<template>
  <label
    class="currency-toggler"
    @click.stop
  >
    <input
      :checked="value"
      type="checkbox"
      class="currency-toggler-input"
      @change="handleChange"
    >
    <div
      class="currency-toggler-box"
      :data-fiat-currency="fiatCurrency"
    />
  </label>
</template>

<script>
export default {
  name: 'CurrencyToggler',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    fiatCurrency: {
      type: String,
      default: 'USD',
    },
  },

  methods: {
    handleChange(e) {
      this.$emit('input', e.target.checked);
    },
  },
};
</script>

<style lang="postcss">
.currency-toggler {
  cursor: pointer;
}

.currency-toggler-input {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0 !important;
  border: 0 !important;
  height: 1px !important;
  width: 1px !important;
  overflow: hidden;
}

.currency-toggler-box:before,
.currency-toggler-box:after {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  height: 16px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-size: 10px;
  text-transform: uppercase;
  transition: 0.25s;
}

.currency-toggler-box:before {
  content: 'ETH';
  border-right: none;
  border-radius: 2px 0px 0px 2px;
}

.currency-toggler-box:after {
  content: attr(data-fiat-currency);
  border-left: none;
  border-radius: 0px 2px 2px 0px;
}

.currency-toggler-input:not(:checked) + .currency-toggler-box:before {
  background: #fff;
  color: #6e32c9;
}

.currency-toggler-input:checked + .currency-toggler-box:after {
  background: #fff;
  color: #6e32c9;
}
</style>

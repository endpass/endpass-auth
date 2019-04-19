<template>
  <header class="widget-header">
    <section class="widget-header-control">
      <h3 class="widget-header-title">
        balance
      </h3>
      <button
        class="widget-header-toggler"
        data-test="widget-header-toggler"
        @click="handleTogglerClick"
      >
        {{ togglerLabel }}
      </button>
    </section>
    <p class="widget-header-balace">
      {{ balance }}
    </p>
  </header>
</template>

<script>
export default {
  name: 'WidgetHeader',

  props: {
    balance: {
      type: String,
      default: '0',
    },

    collapsed: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    togglerLabel() {
      return this.collapsed ? 'Show more' : 'Show less';
    },
  },

  methods: {
    handleTogglerClick() {
      this.$emit('toggle');
    },
  },
};
</script>

<style lang="postcss">
.widget-header {
  padding: 13px 16px 13px 20px;
  color: #fff;
  background-image: url('../../assets/logo-bg.png');
  background-color: #4b016f;
  background-position: 80% center;
  background-size: 55%;
  background-repeat: no-repeat;
}

.widget-header-control {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.widget-header-title {
  flex: 0 0 auto;
  text-transform: uppercase;
  font-size: 12px;
}

.widget-header-toggler {
  flex: 0 0 auto;
  margin-left: auto;
  border: none;
  background: none;
  color: #c0a6ce;
  font-size: 10px;
  cursor: pointer;
}

.widget-header-balace {
  display: inline-block;
  vertical-align: middle;
  font-size: 24px;

  &:after {
    display: inline-block;
    vertical-align: bottom;
    margin-left: 4px;
    content: 'eth';
    font-size: 12px;
    color: #c0a6ce;
  }
}
</style>

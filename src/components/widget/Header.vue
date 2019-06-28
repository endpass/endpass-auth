<template>
  <header
    class="widget-header"
    data-test="widget-header"
    role="button"
    tabindex="0"
    @click="handleTogglerClick"
  >
    <section class="widget-header-control">
      <h3 class="widget-header-title">
        {{ $t('components.widgetHeader.balance') }}
      </h3>
      <span
        class="widget-header-status"
        data-test="widget-header-status"
      >
        {{ statusLabel }}
      </span>
    </section>
    <p
      v-if="balance"
      class="widget-header-balace"
      data-test="balance-label"
    >
      {{ formattedBalance }}
    </p>
    <spinner
      v-else
      :size="24"
    />
  </header>
</template>

<script>
import { fromWei } from '@/util/number';
import Spinner from '@/components/common/Spinner';

export default {
  name: 'WidgetHeader',

  props: {
    balance: {
      type: String,
      default: null,
    },

    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    statusLabel() {
      return this.isCollapsed
        ? this.$i18n.t('components.widgetHeader.showMore')
        : this.$i18n.t('components.widgetHeader.showLess');
    },

    formattedBalance() {
      return fromWei(this.balance);
    },
  },

  methods: {
    handleTogglerClick() {
      this.$emit('toggle');
    },
  },

  components: {
    Spinner,
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
  cursor: pointer;
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

.widget-header-status {
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

@media (max-width: 1023px) {
  .widget-header {
    background-position: 95% center;
    background-size: 150px;
  }
}
</style>

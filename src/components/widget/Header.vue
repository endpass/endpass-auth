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
        <span class="widget-header-status-icon">
          <v-svg-icon
            width="10px"
            height="5px"
            :name="statusIcon"
          />
        </span>
      </span>
    </section>
    <section class="widget-header-content">
      <template v-if="!isLoading">
        <p
          :class="{
            'widget-header-balance': true,
            'is-cutted': isCuttedBalance,
          }"
          :title="actualBalance"
          data-test="balance-label"
        >
          {{ formattedBalance }}
        </p>
        <currency-toggler
          v-model="isBalanceInFiat"
          :fiat-currency="fiatCurrency"
        />
      </template>
      <spinner
        v-else
        :size="24"
        :is-white="true"
      />
      <a
        href="https://wallet.endpass.com"
        target="_blank"
        class="widget-header-link"
      >wallet.endpass.com</a>
    </section>
  </header>
</template>

<script>
import BigNumber from 'bignumber.js';
import { fromWei } from '@/util/number';
import Spinner from '@/components/common/Spinner';
import VSvgIcon from '@/components/common/VSvgIcon';
import CurrencyToggler from './CurrencyToggler.vue';
import { gasPriceStore } from '@/store';

export default {
  name: 'WidgetHeader',

  props: {
    balance: {
      type: String,
      default: null,
    },

    fiatCurrency: {
      type: String,
      default: 'USD',
    },

    isCollapsed: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    ethPriceInFiat: 0,
    isSubscribedOnPrices: false,
    isBalanceInFiat: false,
  }),

  gasPriceStore,

  computed: {
    statusLabel() {
      return this.isCollapsed
        ? this.$i18n.t('components.widgetHeader.showMore')
        : this.$i18n.t('components.widgetHeader.showLess');
    },

    statusIcon() {
      return this.isCollapsed ? 'chevron-down' : 'chevron-up';
    },

    actualBalance() {
      const balanceInEth = fromWei(this.balance);

      if (BigNumber(balanceInEth).isZero()) {
        return '0';
      }

      if (this.isBalanceInFiat) {
        return BigNumber(balanceInEth)
          .times(this.ethPriceInFiat)
          .toFixed(2);
      }

      return BigNumber(balanceInEth).toFixed(6);
    },

    isCuttedBalance() {
      return this.actualBalance.replace(/\./, '').length > 7;
    },

    formattedBalance() {
      if (!this.isCuttedBalance) return this.actualBalance;

      // Splicing length equals to 7 – because we must handle dot symbol
      const splicedBalance = this.actualBalance.slice(0, 7);

      if (/\.$/.test(splicedBalance)) {
        return splicedBalance.replace(/\.$/, '');
      }

      return splicedBalance;
    },

    isLoading() {
      const { balance, isBalanceInFiat, ethPriceInFiat } = this;

      return !balance || (isBalanceInFiat && !ethPriceInFiat);
    },
  },

  watch: {
    isBalanceInFiat(val) {
      if (val && !this.isSubscribedOnPrices) {
        this.subscribeOnEthPrices();
      }
    },
  },

  methods: {
    subscribeOnEthPrices() {
      const handler = () =>
        setTimeout(async () => {
          if (!this.isBalanceInFiat) {
            this.isSubscribedOnPrices = false;
            return;
          }

          this.ethPriceInFiat = await this.$options.gasPriceStore.getEtherPrice(
            this.fiatCurrency,
          );

          handler();
        }, 5000);

      handler();
    },

    handleTogglerClick() {
      if (this.isLoading) return;

      this.$emit('toggle');
    },
  },

  components: {
    Spinner,
    VSvgIcon,
    CurrencyToggler,
  },
};
</script>

<style lang="postcss">
.widget-header {
  padding: 13px 16px 13px 20px;
  color: #fff;
  background-image: url('../../assets/widget-background.jpg');
  background-color: #4b016f;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  outline: none;
}

.widget-header-control {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.widget-header-content {
  display: flex;
  align-items: center;
}

.widget-header-link {
  flex: 0 0 auto;
  color: #fff;
  text-decoration: undeline;
  font-size: 8px;
  font-weight: normal;
  line-height: 1.5;
  margin-left: auto;
}

.widget-header-title {
  flex: 0 0 auto;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.35;
  letter-spacing: 1px;
}

.widget-header-status {
  flex: 0 0 auto;
  margin-left: auto;
  border: none;
  background: none;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.widget-header-status-icon {
  width: 10px;
  height: 5px;
  margin-left: 4px;
}

.widget-header-balance {
  display: inline-block;
  vertical-align: middle;
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  margin-right: 8px;
  letter-spacing: -0.3px;
}

.widget-header-balance.is-cutted:after {
  content: '...';
  margin-left: -6px;
  font-size: 16px;
}
</style>

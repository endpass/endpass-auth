<template>
  <div class="widget">
    <widget-header :collapsed="collapsed" @toggle="handleWidgetToggle" />
    <widget-content
      :collapsed="collapsed"
      :accounts="accounts"
      @account-create="handleAccountCreate"
      @account-change="handleAccountChange"
      @logout="handleLogout"
    />
  </div>
</template>

<script>
import WidgetHeader from './Header.vue';
import WidgetContent from './Content.vue';

export default {
  name: 'Widget',

  data: () => ({
    collapsed: true,
    accounts: [
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD51',
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD520',
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD57',
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD55',
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD59',
      '0xB8c77482e45F1F44dE1745F52C74426C631bDD61',
    ],
  }),

  methods: {
    handleWidgetToggle() {
      this.collapsed = !this.collapsed;
    },

    handleAccountCreate() {
      console.log('accoubt create');
    },

    handleAccountChange(account) {
      console.log('account change: ', account);
    },

    handleLogout() {
      console.log('logout');
    },
  },

  components: {
    WidgetHeader,
    WidgetContent,
  },
};
</script>

<style lang="postcss">
.widget {
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 237px;
  transform: translateX(-50%);
  border-radius: 4px;
  box-shadow: 2px 6px 8px rgba(36, 43, 46, 0.15);
}
</style>

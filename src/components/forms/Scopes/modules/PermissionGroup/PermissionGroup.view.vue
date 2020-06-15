<template>
  <section class="permission-group">
    <header class="permission-group-header">
      <p class="permission-group-title">
        {{ scopesTitle }}
      </p>

      <v-hover
        #default="{ isHover }"
        class="permission-group-tooltip"
      >
        <v-tooltip
          :show="isHover"
          position="bottom-left"
        >
          {{ scopesTooltip }}
        </v-tooltip>
        <v-svg-icon name="info" />
      </v-hover>
    </header>
    <p
      v-if="!isScopesEmpty"
      class="permission-group-scopes"
    >
      {{ $t('components.scopes.access') }} {{ scopesDescription }}
    </p>
  </section>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';
import VTooltip from '@endpass/ui/kit/VTooltip';
import VHover from '@endpass/ui/kit/VHover';
import {
  SCOPES_TRANSLATES,
  SCOPES_TOOLTIPS_TRANSLATES,
} from '@/constants/translates';

export default {
  name: 'PermissionGroupView',

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

  computed: {
    isScopesEmpty() {
      return this.scopes.length === 0;
    },

    scopesTitle() {
      return SCOPES_TRANSLATES[this.rootScope];
    },

    scopesTooltip() {
      return SCOPES_TOOLTIPS_TRANSLATES[this.rootScope];
    },

    scopesDescription() {
      const translatedScopes = this.scopes.map(
        scope => SCOPES_TRANSLATES[scope],
      );

      return translatedScopes.join(', ').toLowerCase();
    },
  },

  components: {
    VSvgIcon,
    VTooltip,
    VHover,
  },
};
</script>

<style lang="postcss">
.permission-group {
  font-size: 14px;
  line-height: 1.43;
}

.permission-group-scopes {
  letter-spacing: -0.175px;
}

.permission-group-header {
  display: flex;
  align-items: center;
}

.permission-group-title {
  flex: 0 0 auto;
  margin-bottom: 4px;
  margin-right: 8px;
  font-weight: bold;
}

.permission-group-tooltip {
  flex: 0 0 auto;
  position: relative;
  width: 16px;
  height: 16px;
  margin-bottom: 6px;
}
</style>

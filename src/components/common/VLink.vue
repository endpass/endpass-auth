<template>
  <a
    class="v-link"
    :class="classNames"
    :href="href"
    :target="target"
    v-on="$listeners"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'VLink',

  props: {
    href: {
      type: String,
      default: '',
    },
    skin: {
      type: String,
      default: 'default',
      validator(value) {
        return ['small-gray', 'default'].indexOf(value) !== -1;
      },
    },
    target: {
      type: String,
      default: '_blank',
      validator(value) {
        return ['_blank', '_parent', '_self', '_top'].indexOf(value) !== -1;
      },
    },
    underline: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classNames() {
      return {
        [`v-link-skin-${this.skin}`]: true,
        [`v-link-underline`]: this.underline,
      };
    },
  },
};
</script>

<style lang="postcss">
.v-link {
  text-decoration: none;
}

.v-link-skin-small-gray {
  font-size: 0.85rem;
  color: #4d4d4d;
  text-decoration: none;

  &:hover {
    color: #4b0472;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;

    &:hover {
      color: #4d4d4d;
    }
  }
}

.v-link-underline {
  text-decoration: underline;
}
</style>

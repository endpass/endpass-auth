<template>
  <div class="mobile-suggestions">
    <header class="mobile-suggestions-header">
      {{ $t('components.uploadVideo.mobileSuggestions.title') }}
    </header>
    <div class="mobile-suggestions-buttons">
      <a
        href="https://apps.apple.com/app/endpass-connect/id1484507596"
        class="mobile-suggestions-button"
        target="_blank"
        data-test="mobile-suggestions-button"
      >
        <v-svg-icon
          name="apple"
          width="32"
          height="32"
          class="mobile-suggestions-button-icon"
        />
        <span class="mobile-suggestions-button-label">
          {{ $t('components.uploadVideo.mobileSuggestions.downloadFromLabel') }}
          <span class="mobile-suggestions-button-store">
            {{ $t('components.uploadVideo.mobileSuggestions.apple') }}
          </span>
        </span>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.endpass.android"
        class="mobile-suggestions-button"
        target="_blank"
        data-test="mobile-suggestions-button"
      >
        <v-svg-icon
          name="google-play"
          width="32"
          height="32"
          class="mobile-suggestions-button-icon"
        />
        <span class="mobile-suggestions-button-label">
          {{ $t('components.uploadVideo.mobileSuggestions.downloadFromLabel') }}
          <span class="mobile-suggestions-button-store">
            {{ $t('components.uploadVideo.mobileSuggestions.googlePlay') }}
          </span>
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import VSvgIcon from '@endpass/ui/kit/VSvgIcon';

export default {
  name: 'MobileSuggestionsView',

  components: {
    VSvgIcon,
  },
};
</script>

<style lang="postcss">
.mobile-suggestions {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 40px;
}
.mobile-suggestions-header {
  font-size: 16px;
  color: var(--endpass-ui-color-grey-8);
}

.mobile-suggestions-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
}

.mobile-suggestions-button {
  display: flex;

  border: 1px solid var(--endpass-ui-color-grey-2);
  border-radius: 8px;

  padding: 8px 16px 8px 18px;

  font-size: 12px;
  color: var(--endpass-ui-color-grey-9);

  text-decoration: none;
}
.mobile-suggestions-button:not(:last-child) {
  margin-right: 20px;
}
.mobile-suggestions-button-icon {
  margin-right: 12px;
  min-width: 32px;
}
.mobile-suggestions-button-label {
  text-align: left;
  line-height: 1.25;
}
.mobile-suggestions-button-store {
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  width: 100%;
}
</style>

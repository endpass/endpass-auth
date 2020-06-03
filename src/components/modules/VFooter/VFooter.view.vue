<template>
  <div class="footer">
    <div class="footer-powered-by" />
    <div class="footer-gradient-container">
      <div class="footer-gradient" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFooterView',
};
</script>

<style type="postcss">
.footer {
  display: flex;
  position: relative;
  color: var(--endpass-ui-color-grey-2);
  height: 92px;
  align-items: center;
}
.footer-powered-by {
  flex: 0 auto;
  background-image: url('../../../assets/powered-by.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 86px;
  height: 34px;
  margin: 0 auto;
}
.footer-gradient-container {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 142px;
  height: 91px;
}
.footer-gradient {
  width: 153px;
  height: 273px;
  transform: rotate(236deg);
  background: linear-gradient(250.32deg, #b067ff 9.73%, #792bef 80.97%);
}
</style>

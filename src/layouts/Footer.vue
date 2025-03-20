<template>
  <div class="footer-content">
    <a href="https://github.com/FuseFairy/HBR-AxleTool-vue" target="_blank">
      <img src="@/assets/custom-icon/github.svg" alt="GitHub" class="github-icon" />
    </a>
    <div class="footer-text">
      Developed by <a href="https://github.com/FuseFairy" target="_blank">Zhuang</a> &
      <a href="https://github.com/Yuuzi261" target="_blank">Yuuzi</a>
    </div>
  </div>
</template>

<style scoped>
.footer-content {
  padding: 10px;
  font-size: 0.8rem;
  color: #808080;
  display: flex;
  align-items: center;
}
.footer-content a {
  color: #808080;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 20px;
}
.footer-content a:hover {
  text-decoration: underline;
  color: #606060;
}
.footer-text > p,
.footer-text > a {
  display: inline;
}
.github-icon {
  width: 20px;
  height: 20px;
  margin-right: 4px;
  filter: invert(1) brightness(0.5);
}
</style>

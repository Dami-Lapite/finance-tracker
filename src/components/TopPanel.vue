<script>
import { contentMixin } from "@/mixins/contentMixin.js";

export default {
  name: "TopPanel",
  mixins: [contentMixin],
};
</script>

<template>
  <div id="TopPanel">
    <div class="float-left">
      <p v-html="content.about" />
    </div>
    <div class="float-right">
      <img
        class="icon"
        src="@/assets/images/icons8-export-csv-50.png"
        alt="download csv"
      />
    </div>
  </div>
</template>

<style lang="scss">
#TopPanel {
  width: 100%;
  height: 60px;
  @include exo;
  .float-left {
    float: left;
    width: fit-content;
    animation: 1s ease-out 0s 1 slideInFromLeft;
    height: 100%;
    margin: 0 10px;
    display: flex;
    p {
      margin: auto;
      color: #024669;
      @include wgt-500;
      &:hover {
        color: $highlight;
        translate: 0px -5px;
      }
    }
  }
  .float-right {
    float: right;
    width: fit-content;
    animation: 1s ease-out 0s 1 slideInFromRight;
    height: 100%;
    margin: 0 10px;
    display: flex;
    .icon {
      margin: auto;
      width: 30px;
      height: 30px;
      &:hover {
        @include highlight-filter;
        translate: 0px -5px;
      }
    }
  }
}
</style>

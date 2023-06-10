<script>
import { useAppStore } from "@/stores/appStore";
import { onMounted } from "vue";

export default {
  setup() {
    const AppStore = useAppStore();

    onMounted(() => {
      AppStore.loadContent();
    });

    return {
      AppStore,
    };
  },
};
</script>

<template>
  <div v-if="AppStore.contentLoaded" id="App"></div>
</template>

<style lang="scss">
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background-color: $app_background;
}

#App {
  background-color: $app_background;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  * {
    transition: 0.2s;
  }
  font-size: 11pt;
  @include md {
    font-size: 11.5pt;
  }
  @include lg {
    font-size: 12pt;
  }
  @include xl {
    font-size: 12.5pt;
  }
}
</style>

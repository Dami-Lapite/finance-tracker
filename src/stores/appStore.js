import { defineStore } from "pinia";
import { isNull, isEmpty } from "lodash";

export const useAppStore = defineStore("AppStore", {
  state() {
    return {
      content: null,
    };
  },
  getters: {
    contentLoaded: (state) => !isNull(state.content) && !isEmpty(state.content),
  },
  actions: {
    loadContent() {
      // Fetch content json from public/content.json
      fetch("./content.json")
        .then((res) => res.json())
        .then(
          (json) => {
            this.content = json;
          },
          (error) => {
            throw error;
          }
        );
    },
  },
});

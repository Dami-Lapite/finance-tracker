import { isEmpty } from "lodash";

export const contentMixin = {
  props: {
    content: {
      type: Object,
      default: null,
    },
  },
  computed: {
    hasContent() {
      return !isEmpty(this.content);
    },
  },
};

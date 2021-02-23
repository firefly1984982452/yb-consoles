<template>
  <div class="article">
    <div v-html="project.detail"></div>
  </div>
</template>

<script>
import { axios } from "youban-utils";
import qs from "qs";

export default {
  props: {
    project: {
      type: Object,
      default() {
        return null;
      },
    },
    session: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  components: {},
  created() {},
  methods: {},
};
</script>
<style scoped>
.article {
  min-height: 500px;
  padding: 10px;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
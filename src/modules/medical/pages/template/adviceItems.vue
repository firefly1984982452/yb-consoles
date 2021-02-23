<template>
  <div class="content">
    <historyTree v-model="category" :key="category.type"></historyTree>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import historyTree from "./categoryTree";

import qs from "qs";

export default {
  data() {
    return {
      category: {},
    };
  },
  components: {
    historyTree,
  },
  created() {
    this.category = { name: "医嘱项目", type: 8 };
  },
  methods: {},
};
</script>
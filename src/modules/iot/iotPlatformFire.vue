<template>
  <div>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
export default {
  data() {
    return { loading: true };
  },
  computed: {},
  created() {
    let user = axios.getCurrentUser();
    let hostname = window.location.protocol + "//" + window.location.host;
    let data = {
      loginUrl: hostname + "/console/login",
      photoUrl: null,
    };
    axios
      .fetch(
        "commonServer",
        "/tenant/iot-platform-url",
        qs.stringify(data),
        null
      )
      .then((res) => {
        window.location.href = res.data;
      });
  },
  mounted() {},
  methods: {},
};
</script>
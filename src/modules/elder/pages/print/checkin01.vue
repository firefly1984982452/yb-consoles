<template>
  <div v-if="estimateId">
    <checkin1Old :elderData="elderData" :estimateId="estimateId" v-if="!isNewVersion" />
    <checkin1New :elderData="elderData" :estimateId="estimateId" v-if="isNewVersion" />
  </div>
</template>

<script>
import checkin1Old from "./checkin01-old";
import checkin1New from "./checkin01-new";
export default {
  components: {
    checkin1Old,
    checkin1New
  },
  props: ["elderData"],
  data() {
    return {
      isNewVersion: false,
      estimateId: "",
    };
  },
  created() {
    this.getEstimateId();
  },
  methods: {
    //获取estimateId
    getEstimateId() {
      let data = {
        elderId: this.elderData.elderId,
      };
      axios.fetch("elderServer", "/elderEstimate/newest", data).then((res) => {
        if (res.data) {
          this.estimateId = res.data.estimateId;
          this.isNewVersion = res.data.version !== null ? true : false;
          console.log(this.isNewVersion);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
tr.page {
  page-break-after: always;
}
.int {
  input {
    margin-left: 6px;
  }
}
.info {
  td {
    padding: 6px 4px;
    p {
      width: 50%;
      float: left;
      font-size: 14px;
      input {
        margin-right: 2px;
      }
    }
  }
}

p {
  span {
    display: inline-block;
    width: 260px;
    text-align: right;
    vertical-align: top;
    line-height: 30px;
  }
}
</style>
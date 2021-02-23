<template>
  <div>
    <checkin12Old v-show="!showNew" />
    <checkin12New v-show="showNew" />
  </div>
</template>
<script>
import tenant from "@/components/_tenant";
import checkin12Old from "./checkin12-old";
import checkin12New from "./checkin12-new";
export default {
  props: {
    elderData: {
      type: Object,
      default() {
        return {
          elderId: "",
          baseInfo: {}, //基础信息和入住管理的数据
          familyData: {}, //家属信息
          healthInfo: {} //健康状况
        };
      }
    }
  },
  components: { checkin12Old, checkin12New },
  data() {
    return {
      estimateId: "",
      showNew: false
    };
  },
  created() {
    tenant.fetchCurrentTenant().then(t => {
      this.nursingHomeName = t.tenantName; // 租户名称
    });
    this.estimateId = this.$route.query.estimateId;
    //老人id为空时便根据照护评估id查询
    let data = {};
    if (this.elderData.elderId) {
      //入住管理过来的打印
      data = {
        elderId: this.elderData.elderId
      };
    } else if (this.estimateId) {
      //照护评估过来的打印
      data = {
        estimateId: this.estimateId
      };
    }
    console.log(data);
    axios.fetch("elderServer", "/elderEstimate/print", data).then(res => {
      this.showNew =
        res.data.version !== null ? true : false;
      console.log(this.showNew);
    });
  },
  methods: {}
};
</script>

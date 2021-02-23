<template>
  <div class="detail">
    <div class="header">
      <el-button icon="el-icon-arrow-left" @click="back">返回</el-button>
    </div>
    <div class="detail-content">
      <div class="detail-left">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>No.{{ advice.adviceNo }}</span>
          </div>
          <el-form>
            <el-form-item label="姓名">
              {{ advice.elderName || elder.name }}
            </el-form-item>
            <el-form-item label="性别">
              {{ advice.gender || elder.gender }}
            </el-form-item>
            <el-form-item label="年龄"> {{ advice.age || elder.age }}周岁 </el-form-item>
            <el-form-item label="房间床位">
              <span v-if=" advice.bedName">
                {{ advice.bedName }}
              </span>
              <span v-else>
                {{ elder.roomName }}-{{ elder.bedName }}
              </span>
            </el-form-item>
            <el-form-item label="入院编号">
              {{ elder.checkinNo }}
            </el-form-item>
            <el-form-item label="费别">
              {{ advice.feeType }}
            </el-form-item>
            <el-form-item label="医保号">
              {{ advice.insuranceNo || elder.insuranceNo }}
            </el-form-item>
            <el-form-item label="过敏史">
              {{ advice.allergicMedicine || elder.allergicMedicine }}
            </el-form-item>
            <el-form-item v-if="advice.createTime" label="就诊日期">
              {{ advice.createTime.substring(0, 10) }}
            </el-form-item>
            <el-form-item v-else label="就诊日期">
              {{ $moment().format('YYYY-MM-DD') }}
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="detail-right">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <div class="illness-box" v-show="activeName == 'first'">
            临床诊断：
            <b v-show="MedicStatu === 'detail'">{{advice.diagnosis}}</b>
            <illness v-show="MedicStatu === 'add' || MedicStatu === 'copy'" ref="firstIllness" @changeIllness="getIllness" />
          </div>

          <el-tab-pane label="电子处方" name="first">
            <!-- {{MedicStatu}}-{{id}} -->
            <recipe-read
              @updateIllnessChild="currentHandleClick"
              @detailId="getDetailIdAdd"
              :adviceId="id"
              v-if="MedicStatu === 'detail'"
              :statu="MedicStatu"
            />
            <recipe-write
              @detailId="getDetailId"
              :adviceId="id"
              :advice="advice"
              :activeName="activeName"
              :dynamicTags="dynamicTags"
              v-else
              :statu="MedicStatu"
            />
          </el-tab-pane>
          <el-tab-pane label="电子病历" name="second">
            <clinic
            ref="childClinic"
              @diagnosisChange="diagnosisChange"
              @getDiagnosis="getDiagnosis"
              :activeName="activeName"
              :advice="advice"
              :id="id"
              :dynamicTags="dynamicTags"
              @saveIdToLocal="saveIdToLocal"
              :statu="statu"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- <recipe v-if="false" :statu="statu" />
    <clinic :statu="statu" /> -->
  </div>
</template>

<script>
import recipeRead from "./components/recipe-read";
import recipeWrite from "./components/recipe-write";
import clinic from "./components/clinic";
import illness from "./components/illness";

export default {
  data() {
    return {
      id: undefined, // 病历处方的id
      MedicStatu: "add",
      statu: "add",
      activeName: "first",
      dynamicTags: [], //临床诊断
      advice: {},
      tenantName: "",
      elder: {}
    };
  },

  created() {
    this.elderId = this.$route.query.elderId;
    // 不是复制进来的 如果有id 就是修改需要给后台的id
    if(this.$route.query.sign !=='copy'){
      this.id = this.$route.query.id || localStorage.getItem("id");
    } else {
      if(this.$route.query.id){
        this.queryDetail(this.$route.query.id);
        this.advice.status = null;
      }
      if(localStorage.getItem("id")){
        this.id = localStorage.getItem("id");
        this.queryDetail(this.id);
      }
    }
    this.MedicStatu = this.$route.query.sign;
    axios
      .fetch("medicalServer", "/api/elder/" + this.elderId, null, null, "get")
      .then(res => {
        this.elder = res.data;
      });
      if(this.id){
        this.queryDetail(this.id);
      }
    this.tenantName = this.$route.query.tenantName;

  },
  components: {
    recipeRead,
    recipeWrite,
    clinic,
    illness
  },
  beforeDestroy() {
    localStorage.removeItem("id");
    localStorage.removeItem("templatValue");
  },
  methods: {
    diagnosisChange(data) {
      this.diagnosis = data;
    },
    // dealUpdateStatu(val) {
    //   console.log(val);
    //   this.MedicStatu = val;
    // },
    back() {
      this.$router.back();
    },
    getIllness(val){
      this.dynamicTags = val;
    },
    handleClick(){
    },
    // 一进入是详情页，手动更新临床诊断内容
    currentHandleClick(){
      this.$refs.firstIllness.setData();
    },
    getDiagnosis(data){
      console.log(data);
      this.$nextTick(()=>{
        this.dynamicTags = data;
        this.$refs.firstIllness.dynamicTags = data;
      })
  },
    getDetailId(val){
      this.saveIdToLocal(val);
      this.MedicStatu = 'detail'
      console.log('detail',this.id)
    },
    getDetailIdAdd(val){
      this.MedicStatu = 'add'
      console.log('detail',this.id)
    },
    // 查询病历处方详情
    queryDetail(id) {
      axios
        .fetch("medicalServer", "/api/advice/detail/" + id, null, null, "get")
        .then((res) => {
          console.log(res.data,'====data');
          this.advice = res.data;
          if(this.$route.query.sign === "copy" && !this.id){
            delete this.advice.adviceNo;
            delete this.advice.status;
            delete this.advice.gender;
            delete this.advice.elderName;
            delete this.advice.bedName;
            delete this.advice.insuranceNo;
            delete this.advice.createTime;
            delete this.advice.insuranceNo;
          }
          this.dynamicTags = res.data.diagnosis ? res.data.diagnosis.split(',') : [];
          console.log(this.dynamicTags,'=====');
          // this.$nextTick(()=>{
            this.$refs.firstIllness.dynamicTags = this.dynamicTags;
          // })
        });
    },
    // 保存id
    saveIdToLocal(id){
      this.id = id;
      window.localStorage.setItem('id',id);
      this.queryDetail(this.id);
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  display: flex;
  height: 100%;
  flex-direction: column;
  .header {
    background-color: #fff;
    height: 56px;
    margin-bottom: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding-left: 15px;
  }
  .detail-content {
    display: flex;
    height: 100%;
    flex: 1;
    > div {
      border-radius: 5px;
    }
    .detail-left {
      width: 250px;
      height: 100%;
      background-color: #fff;
      margin-right: 15px;
    }
    .detail-right {
      box-sizing: border-box;
      padding: 15px;
      flex: 1;
      height: 100%;
      background-color: #fff;
      .illness-box {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}
</style>

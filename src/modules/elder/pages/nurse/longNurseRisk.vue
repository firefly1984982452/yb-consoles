<template>
  <!-- 长护险老人列表 -->
  <div id="" style="padding: 0px;">
    <div v-if="state==1">
      <router-view></router-view>
    </div>
    <el-form ref="searchForm" :inline="true" class="search" :model="searchForm" label-width="75px">
      <el-form-item label="长护险等级" label-width="90px">
        <el-select clearable v-model="searchForm.insuranceLevel" placeholder="请选择">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="到期时间">
        <el-select clearable v-model="searchForm.day" placeholder="请选择">
          <el-option v-for="item in byTime" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人姓名">
        <ub-elder v-model="searchForm.elderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
      </el-form-item>
      <el-button @click="searchInfo" type="primary" icon="el-icon-search">查询</el-button>
      <el-button @click="reset" icon="el-icon-refresh-right">重置</el-button>
    </el-form>
    <!-- 2 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>长护险等级</span>
        <span class="annotation" v-show="isCare">
          <el-icon class="el-icon-info"></el-icon>本院已对接长护险系统，请严格按照实际评估等级与有效期设置相关信息，设置错误可能导致刷卡结算失败。
        </span>
      </div>
      <div class="text item">
        <div class="content">
          <el-row type="flex" class="pannel">
            <el-col class="right">
              <el-button type="success" icon="el-icon-s-claim" @click="subsidy()">长护险结算</el-button>
              <el-button type="primary" icon="el-icon-setting" @click="setLong()">长护险设置</el-button>
            </el-col>
          </el-row>
          <el-table :data="listData" border :header-cell-style="{background:'#F3F3F5'}" class="ub-table">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="elderName" label="姓名" min-width="50"></el-table-column>
            <el-table-column prop="cardNo" label="身份证号" min-width="150"></el-table-column>
            <el-table-column prop="checkinNo" label="入院编号" min-width="60"></el-table-column>
            <el-table-column prop="epb_huji_type" label="入院日期" min-width="50">
              <template slot-scope="scope">
                <span>{{scope.row.checkinDate | dateTimeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="房间床位" min-width="60">
              <template slot-scope="scope">
                <span>{{scope.row.roomName}}<span v-if="scope.row.roomName">-</span>{{scope.row.bedName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="insuranceLevel" label="末次评估等级" min-width="60">
              <template slot-scope="scope">
                <span>{{scope.row.insuranceLevel | levelFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期" min-width="100">
              <template slot-scope="scope">
                <span>{{scope.row.startDate | dateTimeFilter}}<span v-if="scope.row.startDate">至</span>{{scope.row.endDate | dateTimeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="relationName" label="家属姓名" min-width="60"></el-table-column>
            <el-table-column prop="mobilePhone" label="家属联系方式" min-width="90"></el-table-column>
            <el-table-column prop="creator" label="操作人员" min-width="60"></el-table-column>
            <el-table-column label="操作" min-width="60">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
                  <el-button icon="iconfont iconcaozuotubiao-bianji" @click="see(scope.row)" size="mini"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import tenant from "@/components/_tenant";
import { axios } from "youban-utils";
import ubElder from "@/components/elder";
export default {
  data() {
    return {
      isCare: true, // 是否对接了医保
      sign: "",
      levelOptions: [],
      listData: [],
      totalPage: 0,
      currentPage: 1,
      dialogEditVisible: false,
      dialogNewVisible: false,
      level: [1, 2, 3, 4, 5, 6],
      editForm: {
        name: "",
        admiDate: "",
        levelOption: "",
        indate: "",
        elderId: "",
        changeId: "",
        lastLevel: "",
        lastLevelName: "",
        currentLevelName: ""
      },
      newForm: {
        name: "",
        indate: "",
        levelOption: "",
        newGrade: "",
        newIndate: [],
        elderId: "",
        lastLevelName: "",
        currentLevelName: ""
      },
      searchForm: {
        elderName: "",
        insuranceLevel: "",
        day: "",
        pageIndex: 1,
        pageSize: 10
      },
      byTime: [
        {
          value: "15",
          label: "15天以内"
        },
        {
          value: "30",
          label: "30天以内"
        },
        {
          value: "60",
          label: "60天以内"
        }
      ],
      rules: {
        newGrade: [
          { required: true, message: '', trigger: "blur,change" }
        ],
        newIndate: [
          { required: true, message: '', trigger: "blur,change" }
        ],
        levelOption: [
          { required: true, message: '', trigger: "blur,change" }
        ],
        indate: [
          { required: true, message: '', trigger: "blur,change" }
        ]
      }
    };
  },
  components: {
    ubElder
  },
  computed: {},
  async created() {
    let data = await tenant.fetchCurrentTenant();
    let setting = tenant.getTenantSetting('medical_agent', data);
    console.log(setting)
    this.isCare = setting != null ? true : false;

    let expireTime = this.$route.query.expireTime;
    if (expireTime) {
      this.searchForm.day = expireTime;
    }
    this.initLevelOption("长护险评估等级");
  },
  methods: {
    subsidy() {
      let routerUrl = this.$router.resolve({
        path: "/subsidy/longNursingRisksList"
      });
      window.open(routerUrl.href, '_blank');
    },
    setLong() {
      let routerUrl = this.$router.resolve({
        path: '/elder/LongNurseRiskSet'
      });
      window.open(routerUrl.href, '_blank');
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return "padding: 5px 0";
    },
    dataInit() {
      let data = this.searchForm;
      axios
        .fetch("elderServer", "/elderChange/insurance", data)
        .then(res => {
          this.listData = res.data;
          this.totalPage = res.total;
          // this.currentPage = 1;
        });
    },
    //初始化护理等级
    initLevelOption(parentNos) {
      let data = {
        parentNos: parentNos
      };
      let that = this;
      axios
        .fetch("commonServer", "/dict/getItemViewsByParentNo", data)
        .then(res => {
          that.levelOptions = res.data.map(item => {
            return {
              label: item.title,
              value: parseInt(item.itemValue)
            };
          });
        });
    },
    searchInfo() {
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.dataInit();
    },
    /*刷新*/
    reset() {
      this.loading = true;
      this.searchForm.elderName = "";
      this.searchForm.elderId = "";
      this.searchForm.insuranceLevel = "";
      this.searchForm.day = "";
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.dataInit();
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.dataInit();
    },
    see(data) {
      this.$router.push({
        path: "/elder/longNurseRiskList",
        query: {
          assessList: true,
          elderId: data.elderId,
          cardNo: data.cardNo,
          photo: data.elderPhoto
        }
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log(from.name)
    if (from.name == '长护险列表') {
      to.meta.isBack = true;
    }
    next();
  },
  activated() {
    if (!this.$route.meta.isBack) {
      this.$nextTick(() => {
        this.loading = true;
        this.searchForm.elderName = "";
        this.searchForm.elderId = "";
        this.searchForm.insuranceLevel = "";
        this.searchForm.pageIndex = 1;
        this.currentPage = 1;
        let expireTime = this.$route.query.expireTime;
        if (expireTime) {
          this.searchForm.day = '' + expireTime;
        }
        this.dataInit();
      })
    }
    this.dataInit();
    this.$route.meta.isBack = false;
  },
  filters: {
    levelFilter: val => {
      if (val === 0) {
        return "未评级";
      } else if (val === 1) {
        return "护理一级";
      } else if (val === 2) {
        return "护理二级";
      } else if (val === 3) {
        return "护理三级";
      } else if (val === 4) {
        return "护理四级";
      } else if (val === 5) {
        return "护理五级";
      } else if (val === 6) {
        return "护理六级";
      } else if (val === 7) {
        return "外地";
      } else if (val === 8) {
        return "不满60岁";
      } else if (val === 9) {
        return "享受居家养老";
      } else {
        return "--";
      }
    },
    dateTimeFilter: val => {
      if (val) {
        return val.split(" ")[0];
      } else {
        return "--";
      }
    }
  }
};
</script>
<style scoped>
.annotation {
  padding: 0 13px;
  color: #ff5b21;
  font-size: 13px;
}
/deep/.el-button--primary {
  background-color: #2368d3;
}
/deep/ .el-card__body {
  padding: 0;
}
</style>
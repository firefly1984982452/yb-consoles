<template>
  <div>
    <el-form :inline="true" class="search" ref="searchForm" :model="searchForm" label-width="70px">
      <div class="top">
        <div class="left">
          <el-form-item label="老人姓名">
            <!-- <el-input v-model="searchForm.elderName" placeholder="请输入老人姓名" clearable></el-input> -->
          <ub-elder v-model="ubElderId" @change='item => searchForm.elderName = item.elderName' clearable></ub-elder>
          </el-form-item>
          <el-form-item label="房间床位">
            <el-input v-model="searchForm.roomName" placeholder="请输入房间号" clearable></el-input>
          </el-form-item>
          <el-form-item label="户籍类型">
            <el-select
              v-model="dict['户籍类型'].items.item0"
              placeholder="请选择户籍"
              @change="dictUtils.onchange($event, 0, dict['户籍类型'])"
              value-key="itemValue"
              clearable
            >
              <el-option
                v-for="item in dict['户籍类型'].lists.list0"
                :key="item.itemValue"
                :label="item.title"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入院日期">
            <el-date-picker
              v-model="searchForm.checkinDate[0]"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
              clearable
            ></el-date-picker>
            <el-date-picker
              v-model="searchForm.checkinDate[1]"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              clearable
            ></el-date-picker>
          </el-form-item>
          <el-button
            type
            style="background-color:#2368D3;color:#fff;"
            @click="searchUser()"
            icon="el-icon-search"
          >查询</el-button>
          <el-button type @click="reset()" icon="el-icon-refresh-right">重置</el-button>
        </div>
        <div @click="show3 = !show3" class="right">
          <span
            class="btniconfont iconfont iconjichutubiao-shaixuan"
            :class="show3 ? 'yellow' : 'block'"
          >
            <span :class="show3 ? 'yellow' : 'block'" style="margin-left:8px;">高级筛选</span>
            <i
              :class="[
                show3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down',
                show3 ? 'yellow' : 'block'
              ]"
            ></i>
          </span>
          <!-- <i v-if="!show3" class="btniconfont iconfont iconjichutubiao-shaixuan" style="font-size: 12px;"></i>
					<i v-if="show3" class="btniconfont iconfont iconjichutubiao-shaixuan" style="font-size: 12px;color:#F2814F;"></i>
          <span v-if="!show3">高级筛选</span>-->
          <!-- <span v-if="show3" style="color:#F2814F;">高级筛选</span>
					<img v-if="!show3" src='http://image.youbankeji.com/web/dahuaAdmin/jiantouFunction.png' alt=""/>
          <img v-if="show3" src='http://image.youbankeji.com/web/dahuaAdmin/jiantouFunction2.png' alt=""/>-->
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="show3" style="margin-top: 10px;">
          <el-row type="flex" class="row-bg" :gutter="0">
            <!-- <el-col :span="4.4"> -->
            <el-form-item label="入院编号">
              <el-input v-model="searchForm.checkinNo" placeholder="请输入入院编号" clearable></el-input>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="4.4"> -->
            <el-form-item label="楼层">
              <el-cascader
                v-model="buildingFloor"
                clearable
                placeholder="楼层"
                @change="changeBuilding"
                :props="{ checkStrictly: false }"
                :options="buildingOption"
                change-on-select
              ></el-cascader>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="4.5"> -->
            <el-form-item label="院方护理等级" label-width="100px">
              <el-select
                v-model="dict['院方护理等级'].items.item0"
                placeholder="请选择院方护理等级"
                @change="dictUtils.onchange($event, 0, dict['院方护理等级'])"
                value-key="itemValue"
                clearable
              >
                <el-option
                  v-for="item in dict['院方护理等级'].lists.list0"
                  :key="item.itemValue"
                  :label="item.title"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="5.8"> -->
            <el-form-item label="长护险护理等级" label-width="110px">
              <el-select
                v-model="dict['长护险评估等级'].items.item0"
                placeholder="请选择长护险等级"
                @change="dictUtils.onchange($event, 0, dict['长护险评估等级'])"
                value-key="itemValue"
                clearable
              >
                <el-option
                  v-for="item in dict['长护险评估等级'].lists.list0"
                  :key="item.itemValue"
                  :label="item.title"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="4"> -->
            <el-form-item label="出生月份">
              <el-select
                style="width:165px;"
                v-model="searchForm.months"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in birthOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                style="width:165px;"
                v-model="searchForm.status"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in statusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="2.4"></el-col> -->
          </el-row>
        </div>
      </el-collapse-transition>
    </el-form>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="right">
          <el-button type="primary" icon="el-icon-download" @click="excelout">数据导出</el-button>
          <el-button type="success" icon="el-icon-plus" @click="addLive()">入住登记</el-button>
          <el-button class="button-purple" icon="el-icon-document-copy" @click="importArea()">同步数据</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border class="ub-table">
        <el-table-column prop="checkinNo" label="入院编号" min-width="60"></el-table-column>
        <el-table-column prop="elderName" label="老人姓名" min-width="70">
          <template slot-scope="scope">{{ scope.row.elderName }}</template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" min-width="40">
          <template slot-scope="scope">
            {{
            scope.row.gender | sexFilter
            }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" min-width="40">
          <template slot-scope="scope">{{ scope.row.age }}</template>
        </el-table-column>
        <el-table-column prop="registerType" label="户籍类型" min-width="70">
          <template slot-scope="scope">{{ scope.row.registerType }}</template>
        </el-table-column>
        <el-table-column label="房间床位" min-width="72">
          <template slot-scope="scope">
            {{ scope.row.roomName }}
            <span v-if="scope.row.roomName">-</span>
            {{ scope.row.bedName }}
          </template>
        </el-table-column>
        <el-table-column prop="ef_name" label="院方护理等级" min-width="60">
          <template slot-scope="scope">
            {{
            scope.row.nursingLevel | levelFilter
            }}
          </template>
        </el-table-column>
        <el-table-column prop="birthDay" label="出生日期" min-width="80">
          <template slot-scope="scope">
            {{
            scope.row.birthDay | dateTimeFilter
            }}
          </template>
        </el-table-column>
        <el-table-column prop="checkinDate" label="入住时间" min-width="100">
          <template slot-scope="scope">
            {{
            scope.row.checkinDate | dateTimeFilter
            }}
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="接待人" min-width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.operatorName">
              {{
              scope.row.operatorName
              }}
            </span>
            <span v-else>{{ scope.row.creatorName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="70">
          <template slot-scope="scope">
            {{
            scope.row.status | statusFilter
            }}
          </template>
        </el-table-column>
        <el-table-column label="同步区网" min-width="70">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.syncStatus"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleStatusChange(scope.row)"
                >
            </el-switch>
          </template>
          <!-- <template slot-scope="scope">
            {{
            scope.row.syncStatus | syncStatusFilter
            }}
          </template> -->
        </el-table-column>
        <el-table-column label="操作" min-width="80%">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top-end">
              <el-button
                size="mini"
                @click="see(scope.row)"
                icon="iconfont iconcaozuotubiao-chakan"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button
                size="mini"
                @click="repair(scope.row)"
                icon="iconfont iconcaozuotubiao-bianji"
              ></el-button>
            </el-tooltip>
            <!-- 状态为已经离院就只有查看和打印按钮 -->
            <el-tooltip class="item" effect="dark" content="打印" placement="top-end">
              <el-button
                v-if="scope.row.status==100"
                size="mini"
                @click="print(scope.row, 'dy')"
                icon="iconfont iconcaozuotubiao-dayin"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { axios } from "youban-utils";
import utilsTable from "@/utils/table";
import { dictUtils } from "youban-utils";
import settings from '@/settings'
import ubElder from "@/components/elder";

export default {
  components: {
    ubElder
  },
  data() {
    return {
      ubElderId: '',
      show3: false,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      buildingOption: [],
      statusOption:[
        {
          label:'办理中',
          value: 0
        },
        {
          label:'已入住',
          value: 100
        }
      ],// 入住状态
      buildingFloor: [],
      //查询条件数据
      searchForm: {
        elderName: "",
        status:'',
        roomName: "",
        checkinDate: [],
        checkinNo: "",
        buildingId: "",
        floor: "",
        nursingLevel: "",
        insuranceLevel: "",
        months: "",
        pageIndex: 1,
        pageSize: 10
      },
      currentPage: 1,
      totalPage: 0,
      tableData: [],
      dict: {
        户籍类型: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        院方护理等级: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        },
        长护险评估等级: {
          values: {
            value0: null
          },
          items: {
            item0: null
          }
        }
      },
      birthOption: [
        {
          value: 1,
          label: "1月"
        },
        {
          value: 2,
          label: "2月"
        },
        {
          value: 3,
          label: "3月"
        },
        {
          value: 4,
          label: "4月"
        },
        {
          value: 5,
          label: "5月"
        },
        {
          value: 6,
          label: "6月"
        },
        {
          value: 7,
          label: "7月"
        },
        {
          value: 8,
          label: "8月"
        },
        {
          value: 9,
          label: "9月"
        },
        {
          value: 10,
          label: "10月"
        },
        {
          value: 11,
          label: "11月"
        },
        {
          value: 12,
          label: "12月"
        }
      ]
    };
  },
  created() {
    this.dictUtils = new dictUtils(this.dict);
    this.initBuilding();
    this.fetchData();
  },
  methods: {
    ...utilsTable,
    fetchData() {
      this.searchForm.registerType =
        this.dict["户籍类型"].values.value0 === null
          ? ""
          : this.dict["户籍类型"].values.value0;
      this.searchForm.nursingLevel =
        this.dict["院方护理等级"].values.value0 === null
          ? ""
          : this.dict["院方护理等级"].values.value0;
      this.searchForm.insuranceLevel =
        this.dict["长护险评估等级"].values.value0 === null
          ? ""
          : this.dict["长护险评估等级"].values.value0;

      if(!this.searchForm.checkinDate[0]!==!this.searchForm.checkinDate[1]){
          this.$message.error('请选择完整入院日期');return;
      } else if(this.$moment(this.searchForm.checkinDate[0]).valueOf()>this.$moment(this.searchForm.checkinDate[1]).valueOf()){
          this.$message.error('开始时间不能超过结束时间');return;
      }

      axios
        .fetch("elderServer", "/elderInfo/all", this.searchForm)
        .then(res => {
          this.tableData = res.data;
          this.totalPage = res.total;
        });
    },
    initBuilding() {
      let that = this;
      axios.fetch("oaServer", "/org/building/list").then(res => {
        let opt = [];
        let building = res.data;
        building.forEach(item => {
          let subOpt = {};
          subOpt.value = item.buildingId;
          subOpt.label = item.buildingName;
          let floor = parseInt(item.floors);
          if (typeof floor == "number") {
            let children = [];
            for (let i = 0; i < floor; i++) {
              let sub = {};
              sub.value = i + 1;
              sub.label = i + 1 + "层";
              children.push(sub);
            }
            subOpt.children = children;
          }
          opt.push(subOpt);
        });
        that.buildingOption = opt;
      });
    },
    changeBuilding(value) {
      this.buildingFloor = [value[0], value[1]];
      this.searchForm.buildingId = value[0];
      this.searchForm.floor = value[1];
    },
    /*同步市区网*/
    importArea() {
      this.loading = true;
      this.$axios.fetch('datasyncServer',"/district/cityData").then(res => {
          this.loading = false;
          if(res.code == 200){
              this.$message.success(res.data);
          } else {
              this.$message.error(res.message);
          }
      });
      this.$axios.fetch('datasyncServer',"/district/elder")
        .then(res => {
          this.loading = false;
          if (res.code == 200) {
              this.$message.success(res.data);
          } else if (res.code == "401") {
            this.$message({
              message: res.message,
              type: "warning"
            });
            this.$router.push("/login");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          ////console.log(err);
          this.loading = false;
        });
    },
    /*导出*/
    excelout() {
      const param = {
        elderName: this.searchForm.elderName,
        status: this.searchForm.status,
        roomName: this.searchForm.roomName,
        checkinDate: this.searchForm.checkinDate,
        checkinNo: this.searchForm.checkinNo,
        buildingId: this.searchForm.buildingId,
        floor: this.searchForm.floor,
        nursingLevel: this.searchForm.nursingLevel,
        insuranceLevel: this.searchForm.insuranceLevel,
        months: this.searchForm.months,
      }
      var temp = document.createElement("form");
      temp.action = settings.servers.elderServer + '/elderInfo/excel';
      // temp.action = 'http://192.168.3.209:8087/elderInfo/excel';
      temp.method = "post";
      temp.style.display = "none";
      for (var x in param) {
          var opt = document.createElement("input");
          opt.name = x;
          opt.value = param[x];
          temp.appendChild(opt);
      }
      document.body.appendChild(temp);
      temp.submit();
      document.body.removeChild(temp);
      this.$message.success('导出成功');
    },
    print(data) {
      this.$router.push({
        path: "/elder/checkin/print",
        query: {
          elderId: data.elderId
        }
      });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val;
      this.fetchData();
    },
    see(data) {
      this.$router.push({
        path: "/elder/checkInSee",
        query: {
          elderId: data.elderId
        }
      });
    },
    resetLoacalStorage(){
        window.localStorage.removeItem("blueNav");
        window.localStorage.removeItem("grayNav"); 
        window.localStorage.removeItem("elderId");
        window.localStorage.removeItem("elderName");
        window.localStorage.removeItem("nursingLevel");
        window.localStorage.removeItem("checkinDate");
        window.localStorage.removeItem("notEdit");
        window.localStorage.removeItem("hasRuZhuHeTong");
    },
    repair(data) {
       this.resetLoacalStorage();
      this.$router.push({
        path: "/elder/checkInEdit",
        query: {
          elderId: data.elderId,
          elderName: data.elderName,
          nursingLevel: data.nursingLevel,
          checkinDate: data.checkinDate,
          sign: "repair"
        }
      });
    },
    /*按条件查询老人数据*/
    searchUser() {
      this.currentPage = 1;
      this.searchForm.pageIndex = 1;
      this.fetchData();
    },
    /*创建入院单*/
    addLive(data) {
      this.resetLoacalStorage();
      this.$router.push({
        path: "/elder/checkInEdit",
        query: {
          sign: "add"
        }
      });
    },
    reset() {
      this.buildingFloor = [];
      this.ubElderId = '';
      this.searchForm = {
        elderId: "",
        elderName: "",
        roomName: "",
        roomId: "",
        registerType: "",
        checkinDate: [],
        checkinNo: "",
        buildingId: "",
        floor: "",
        nursingLevel: "",
        insuranceLevel: "",
        months: "",
        status:"",
        pageIndex: 1,
        pageSize: 10
      };
      this.currentPage = 1;
      
      this.dict["户籍类型"].values.value0 = null;
      this.dict["院方护理等级"].values.value0 = null;
      this.dict["长护险评估等级"].values.value0 = null;
      this.dict["户籍类型"].items.item0 = null;
      this.dict["院方护理等级"].items.item0 = null;
      this.dict["长护险评估等级"].items.item0 = null;
      this.dictUtils.setValues(this.dict);
      this.fetchData();
    },
    // 切换区网同步
    handleStatusChange(data){
        axios.fetch('elderServer','/elderInfo/editSync',{
            elderId:data.elderId,
            syncStatus:data.syncStatus,
        },'json').then(res=>{
            this.$message.success('操作成功!')
        })
    }
  },
  watch: {
    $route(to, from) {
      this.searchForm.pageIndex = 1;
      this.currentPage = 1;
      this.fetchData();
    }
  },
  filters: {
    statusFilter: val => {
      if (val === 0) {
        val = "办理中";
      } else if (val === 100) {
        val = "已入住";
      } else if (val === 200) {
        val = "已离院";
      } else {
        val = "办理中";
      }
      return val;
    },
    syncStatusFilter: val => {
      if (val === 0) {
        val = "不同步";
      } else if (val === 1) {
        val = "需要同步";
      }
      return val;
    },
    dateTimeFilter: val => {
      if (val) {
        return val.split(" ")[0];
      }
    },
    sexFilter: val => {
      if (val == 1) {
        val = "男";
      } else if (val == 0) {
        val = "女";
      }
      return val;
    },
    levelFilter: val => {
      if (val == 0) {
        val = "无护理";
      } else if (val == 1) {
        val = "护理一级";
      } else if (val == 2) {
        val = "护理二级";
      } else if (val == 3) {
        val = "护理三级";
      } else if (val == 4) {
        val = "护理四级";
      } else if (val == 5) {
        val = "护理五级";
      } else if (val == 6) {
        val = "护理六级";
      }
      return val;
    }
  }
};
</script>
<style scoped>
.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.right {
  height: 40px;
  line-height: 40px;
}
.yellow {
  color: rgb(242, 129, 79);
}
.block {
  color: #222222;
}
#liveCrList .el-pagination {
  float: right;
  position: relative;
  margin: 2rem auto;
  left: -50%;
  transform: translateX(50%);
}

#liveCrList .el-pagination__editor.el-input {
  width: 50px;
}

#liveCrList .lookta:hover {
  background: transparent;
  color: #3e6fa8;
}

#liveCrList .repair:hover {
  background: transparent;
  color: #4aa8ee;
}

#liveCrList .zuanta:hover {
  background: transparent;
}

#liveCrList .cancel:hover {
  background: transparent;
}

#liveCrList .lookta:hover {
  background: transparent;
  color: #3e6fa8;
}

#liveCrList .repair:hover {
  background: transparent;
  color: #4aa8ee;
}

#liveCrList .zuanta:hover {
  background: transparent;
}

#liveCrList .cancel:hover {
  background: transparent;
}

.navBtn {
  width: 90% !important;
}

.btn-font-size {
  font-size: 14px;
  font-weight: 500;
}

.daoruBtn:hover {
  background: #f49b31;
  color: white;
  border: 1px solid #f49b31;
}
</style>

<template>
  <div class="app-container" id="liveCrList">
    <el-button class="addEquipment" @click="addPlan" icon="el-icon-plus">
      新增计划
    </el-button>
      <el-table :data="tableData" border>
        <el-table-column label="编号" width="60" type="index"></el-table-column>
        <el-table-column label="计划名称" prop="scheduleName"></el-table-column>
        <el-table-column label="分类" prop="scheduleName">
            <template slot-scope="scope">
              <span v-if="scope.row.scheduleType==1">设备巡查</span>
              <span v-if="scope.row.scheduleType==2">楼层巡查</span>
            </template>
        </el-table-column>
        <el-table-column label="频次" prop="interval">
          <template slot-scope="scope">
            <span>{{scope.row.interval}}次/</span>
            <span>{{scope.row.durationType | filterDurationType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡查点位" prop="positionCount"></el-table-column>
        <el-table-column label="开始时间" prop="startDate"></el-table-column>
        <el-table-column label="结束时间" prop="endDate"></el-table-column>
        <el-table-column label="状态" prop="scheduleName">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">未开始</span>
            <span v-if="scope.row.status==1">进行中</span>
            <span v-if="scope.row.status==2">已完成</span>
            <span v-if="scope.row.status==3">已核查</span>
            <span v-if="scope.row.status==3">已过期</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
              <el-button size="mini" class="lookta" @click="edit(scope.row)">
                <i class="iconfont iconcaozuotubiao-bianji"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="手动添加" placement="top-end">
              <el-button size="mini" class="lookta" @click="tjrw(scope.row)">
                <i
                  class="iconfont icontubiao-caozuotubiao-shoudongshengchengxungengrenwu"
                ></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="生成二维码" placement="top-end">
              <el-button size="mini" class="lookta" @click="scewm(scope.row)">
                <i
                  class="iconfont icontubiaocaozuotubiaoerweimaxiawu"
                ></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage3"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    <el-dialog title="手动生成巡更任务" :visible.sync="dialogVisible" width="20%" style="margin-top: 10vh;">
      <div class="xgrq">
        <!-- <div>巡更日期</div> -->
        <el-form :model="form" :rules="rules">
          <el-form-item label="巡更日期" prop="xgrq">
            <el-date-picker
              v-model="form.xgrq"
              type="date"
              placeholder="请选择"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="diafoot">
        <el-button class="footA" @click="closedigA()">生成</el-button>
        <el-button class="footB" @click="closedigB()">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      scheduleId: "",
      form: {
        xgrq: ""
      },
      btnArr: ["巡更计划", "巡更任务"],
      routerArr: ["/fire/xunCha/xunChaPlan", "/fire/xunCha/xunChaWork"],
      isactive: "0",
      searchData: {
        pageIndex: 1,
        pageSize: 10
      },
      rules: {
        xgrq: [
          {
            required: true,
            message: "",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  mounted() {
    this.loading = true;
    this.currentPage3 = 1;
    this.allData();
  },
  methods: {
    scewm(value) {
      this.$router.push({
        path: "/fire/xunCha/createCodes",
        query: {
          scheduleId: value.scheduleId,
          scheduleType: value.scheduleType
        }
      });
    },
    allData() {
      axios.fetch('fireServer', "/patrol/schedule/get/pager",this.searchData).then(res => {
        this.loading = false;
        if (res.code == 200) {
          this.tableData = res.data;
          this.totalPage = res.total;
          this.$forceUpdate();
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
        console.log(err)
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.searchData.pageIndex = val;
      this.allData();
    },
    addPlan() {
      this.$router.push("/fire/xunCha/addXunChaPlan");
    },
    edit(value) {
      this.$router.push({
        path: "/fire/xunCha/addXunChaPlan",
        query: {
          scheduleId: value.scheduleId,
          scheduleType: value.scheduleType
        }
      });
    },
    tjrw(value) {
      this.scheduleId = value.scheduleId;
      this.dialogVisible = true;
    },
    closedigA(value) {
      if(this.form.xgrq == "" || this.form.xgrq == null) {
        return this.$message.error("请选择巡更日期");
      }
      let data = {
        scheduleId: this.scheduleId,
        patrolDate: this.form.xgrq
      };
      let that = this;
      axios.fetch('fireServer', "/patrol/schedule/anytime/add",data).then(res => {
          that.loading = false;
          console.log(res.data);
          if (res.code == 200) {
            that.$message({
              message: "添加成功",
              type: "success"
            });
            that.dialogVisible = false;
            this.allData();
          } else {
            that.$message.error(error);
            that.dialogVisible = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    closedigB() {
      this.dialogVisible = false;
    }
  },
  filters:{
    filterDurationType(val){
      // 0按小时，1按天，2按周，3按月，4按季，5按年，6按双周，7按半个月
      return ['小时','天','周','月','季','年','双周','半个月'][val];
    }
  }
};
</script>

<style scoped>
.addEquipment {
  width: 95px;
  height: 36px;
  background: #6cbc6c;
  color: white;
  float: right;
  margin-bottom: 20px;
}

.addEquipment .btniconfont {
  color: white;
  font-size: 12px;
}

.box-card .item {
  margin-bottom: 0px;
}

.dialogText {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
}
/deep/.el-checkbox__label {
  width: 0px;
}
.checkBtn {
  width: 95px;
  height: 36px;
  border: none;
  margin-bottom: 5px;
}

.searchBtnsStyle {
  width: 95px;
  height: 36px;
  background: #4687e1;
  border: 1px solid #4687e1;
  border-radius: 4px;
  color: white;
  margin-bottom: 5px;
}
/*.el-pagination{
		position: absolute;
		bottom: 14px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		margin: 10px 0;
	}*/
.footA {
  display: float;
  width: 20%;
  background: #3f51b5;
  color: #ccc;
}
.footB {
  display: float;
  width: 20%;
}
.xgrq {
  padding-left: 15px;
}
.xgrq .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 60%;
}

/* .xgrq .el-form-item__content{
	width:240px;
	} */
</style>
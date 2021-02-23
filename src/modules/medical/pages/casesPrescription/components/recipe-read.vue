<template>
  <div>
    <div class="content" id="a">
      <el-row type="flex" class="pannel">
        <el-col class="right" style="margin: 0 50px 0 0;">
          <div v-if="advice.status!=-1">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="updateStatu()"
              v-if="advice.status < 2&&advice.source==2"
              >修改</el-button
            >
            <el-button type="primary" icon="el-icon-printer"
            @click="printRecord()"
              >打印处方</el-button
            >
          </div>
        </el-col>
      </el-row>

      <div style="overflow:hidden;">
        <el-table
          style="margin-left:-48px;"
          :data="adviceGroups"
          ref="adviceTable"
          border
          class="ub-table"
          :expand-row-keys="expands"
          :row-key="getRowKeys"
          @expand-change="expandSelect"
        >
          <el-table-column type="expand" width="0">
            <template slot-scope="props">
              <el-table
                :data="props.row.items"
                style="width: calc(100% - 47px);margin-left:47px;"
                class="two-list"
                v-if="props.row.itemCount > 1"
              >
                <el-table-column label="组号" width="50">
                  <template slot-scope="scope">
                    <el-button
                      type="success"
                      @click="setTop(props.$index, scope.$index)"
                      icon="el-icon-top"
                      v-show="statu === 'add'"
                      circle
                    ></el-button>
                  </template>
                </el-table-column>
                <el-table-column label="组" width="40">
                  <template slot-scope="scope">
                    <span v-if="scope.$index == props.row.items.length - 1"
                      >┗</span
                    ><span v-else>┃</span>
                  </template>
                </el-table-column>
                <el-table-column label="内容" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column label="规格" align="left">
                  <template slot-scope="scope">
                    {{ scope.row.standard }}
                  </template>
                </el-table-column>
                <el-table-column label="单次剂量" width="100">
                  <template slot-scope="scope">
                    {{ scope.row.useCount }}{{ scope.row.useUnit }}
                  </template>
                </el-table-column>
                <el-table-column label="用法" align="left" width="150">
                  <template slot-scope="scope">
                    <p>
                      {{ scope.row.way }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="用药时间">
                  <template slot-scope="scope">
                    <p v-if="scope.row && scope.row.useTime">
                      {{ scope.row.useTime }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="频率" align="left" width="150">
                  <template slot-scope="scope">
                    <p>
                      {{ scope.row.rate }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="天数">
                  <template slot-scope="scope">
                    <p>
                      {{ scope.row.day }}
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="总量">
                  <template slot-scope="scope">
                    {{ scope.row.quantity }}{{ scope.row.unit }}
                  </template>
                </el-table-column>
                <el-table-column label="来源" width="50">
                  <template slot-scope="scope">
                    {{ scope.row.source | filterSource }}
                  </template>
                </el-table-column>
                <el-table-column label="嘱托备注">
                  <template slot-scope="scope">
                  {{scope.row.remark}}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="组号" width="50">
            <template slot-scope="scope">
              <p>{{ scope.$index + 1 }}</p>
            </template>
          </el-table-column>
          <el-table-column label="组" width="40">
            <template slot-scope="scope">
              <span v-if="scope.row.items">┏</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" align="left">
            <template slot-scope="scope">
              {{ scope.row.main.name }}
            </template>
          </el-table-column>
          <el-table-column label="规格" align="left">
            <template slot-scope="scope">
              {{ scope.row.main.standard }}
            </template>
          </el-table-column>
          <el-table-column label="单次剂量" width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.main.useCount }}{{ scope.row.main.useUnit }}</p>
            </template>
          </el-table-column>
          <el-table-column label="用法" align="left" width="150">
            <template slot-scope="scope">
              <p>
                {{ scope.row.way }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="用药时间">
            <template slot-scope="scope">
              <p>
                {{ scope.row.useTime }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="频率" align="left" width="150">
            <template slot-scope="scope">
              <p>
                {{ scope.row.rate }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="天数">
            <template slot-scope="scope">
              <p>
                {{ scope.row.day }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="总量">
            <template slot-scope="scope">
              {{ scope.row.main.quantity }}{{ scope.row.main.unit }}
            </template>
          </el-table-column>
          <el-table-column label="来源" width="50">
            <template slot-scope="scope">
              {{ scope.row.main.source | filterSource }}
            </template>
          </el-table-column>
          <el-table-column label="嘱托备注">
            <template slot-scope="scope">
              {{ scope.row.useRemark}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="printVisible" v-if="printVisible" :close-on-click-modal="false" width="146mm" append-to-body show-close=false>
      <printRecipel :advice="advice" :tenantName="tenantName" :elder="elder" @close="printVisible=false;fetchData()"></printRecipel>
    </el-dialog>
  </div>
</template>

<script>
import printRecipel from "../../advice/printRecipel";
export default {
  data() {
    return {
      adviceGroups: [],
      expands: [],
      printVisible: false,
      advice: {},
      elder:'',
      tenantName:'',
    };
  },
  props: {
    adviceId: "",
    detailId: '',
  },
  components: {
    printRecipel
  },
  mounted() {
    this.tenantName = this.$route.query.tenantName;
    this.queryDetail();
    this.getdata();
  },
  methods: {
    getdata() {
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/groups/" + this.adviceId,
          null,
          null,
          "get"
        )
        .then(res => {
          this.updatePage(res.data);
        });
    },
    expandSelect(row, expandedRows) {
      this.$refs.adviceTable.toggleRowExpansion(row, true);
    },
    tableRowClassName({ row }) {
      let className = "";
      if (row.status == 10) {
        className += " invalid";
      } else if (row.status == 2) {
        className += " running";
      } else if (row.status == 5) {
        className += " stopped";
      } else {
        className += " commit";
      }
      if (row.itemCount == 1) {
        className += " single";
      }
      return className;
    },
    getRowKeys(row) {
      return row.id;
    },

    // 更新页面
    updatePage(data) {
        this.adviceGroups = JSON.parse(JSON.stringify(data));
        this.adviceGroups = this.adviceGroups.map(val => {
          val.isSelected = false;
          return val;
        });
        if (this.adviceGroups.length > 0) {
          this.expands = this.adviceGroups.map(item => item.id);
        }
    },

    // 修改
    updateStatu(){
      // this.$emit('childUpdateStatu', 'add');
      // localStorage.setItem("id", this.adviceId)
      this.$emit("detailId", this.adviceId);
    },

    // 查询病历处方详情
    queryDetail() {
      axios
        .fetch("medicalServer", "/api/advice/detail/" + this.adviceId, null, null, "get")
        .then((res) => {
          this.advice = res.data;
          // if(res.data.diagnosis){
          //   localStorage.setItem("dynamicTags", res.data.diagnosis);
          //   this.$emit('updateIllnessChild');
          // }
        });
      let elderId = this.$route.query.elderId;
      axios
        .fetch("medicalServer", "/api/elder/" + elderId, null, null, "get")
        .then((res) => {
          this.elder = res.data;
        });
    },

    // 打印
    printRecord() {
      this.printVisible = true;
    },
  },
  filters: {
    filterSource(val) {
      return ["", "内配", "自备"][val];
    }
  }
};
</script>

<style lang="less" scoped>
.view-container .el-button {
  min-width: unset;
}
</style>

<style scoped>
.static-item .el-form-item,
.static-item .el-form-item--mini.el-form-item,
.static-item .el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
.static-item .el-form-item__content span {
  font-weight: 700;
}
/deep/ .el-divider--horizontal {
  background: 0 0;
  border-top: 1px dashed #d4d4d4;
}

.el-input >>> .el-input-group__append,
.el-input >>> .el-input-group__prepend {
  padding-left: 8px;
  padding-right: 8px;
  min-width: 35px;
}

/deep/ .el-table__expanded-cell {
  padding: 0px;
}
/deep/ .el-table__expanded-cell .el-table__header-wrapper {
  display: none;
}

/deep/ .el-table__expanded-cell table {
  border-left: 1px solid #dcdfe6;
}
/deep/ .invalid {
  text-decoration: line-through;
  color: red;
}
/deep/ .single .el-table__expand-icon {
  display: none;
}
/deep/ .single + tr {
  display: none;
}
/deep/ .el-table__body-wrapper {
  overflow: hidden;
}
</style>

<template>
  <el-form label-width="80px" size="mini" class="static-item" style="overflow:hidden">
    <el-row style="margin:16px;" v-if="showNo">
      <el-col :span="12">
        <el-form-item label="" label-width="0">
          <span>No.{{advice.adviceNo}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="8" offset="4">
        <el-form-item label="类型">
          <span>{{advice.category}}通药品处方</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-card class="box-card" style="margin:16px;">
      <el-row>
        <el-col :span="6">
          <el-form-item label="姓名">
            <span>{{elder.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="性别">
            <span>{{elder.gender}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="年龄">
            <span>{{elder.age}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="处方日期">
            <span>{{advice.createTime.substring(0,10)}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="入院编号">
            <span>{{elder.checkinNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="房间床位">
            <span>{{elder.roomName}}-{{elder.bedName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="费别">
            <span>{{advice.feeType}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="医保卡号">
            <span>{{elder.insuranceNo}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="临床诊断">
            <span>{{advice.diagnosis}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <div style="margin:16px;overflow:hidden;width:calc(100% + 16px);float:left;">
      <el-table :data="adviceGroups" ref="adviceTable" style="margin-left:-48px;" border class="ub-table" :expand-row-keys="expands" :row-key="getRowKeys" :row-class-name="tableRowClassName" @expand-change="expandSelect" v-if="adviceGroups.length>0">
        <el-table-column type="expand" width="0">
          <template slot-scope="props">
            <el-table :data="props.row.items" style="width: calc(100% - 47px);margin-left:47px;" class="two-list" :row-class-name="tableRowClassName(props)" v-if="props.row.itemCount>1">
              <el-table-column label="组" width="50">
                <template slot-scope="scope">
                  <span v-if="scope.$index==props.row.items.length-1">┗</span><span v-else>┃</span>
                </template>
              </el-table-column>
              <el-table-column label="内容" width="440" align="left">
                <template slot-scope="scope">
                  {{scope.row.name}} <span class="kit-medicine" v-if="scope.row.source==2">[自备/外配]</span></br>{{scope.row.standard}}
                </template>
              </el-table-column>
              <el-table-column label="单次剂量" width="100">
                <template slot-scope="scope">
                  {{scope.row.useCount}}{{scope.row.useUnit}}
                </template>
              </el-table-column>
              <el-table-column label="用法/频次" width="100" align="left">

              </el-table-column>
              <el-table-column label="总量" width="80" align="left">
                <template slot-scope="scope">
                  {{scope.row.quantity}}{{scope.row.unit}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="组" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.items">┏</span>
          </template>
        </el-table-column>
        <el-table-column label="内容/规格" width="440" align="left">
          <template slot-scope="scope">
            {{scope.row.main.name}}<span class="kit-medicine" v-if="scope.row.main.source==2">[自备/外配]</span></br>{{scope.row.main.standard}}
          </template>
        </el-table-column>
        <el-table-column label="单次剂量" width="100">
          <template slot-scope="scope">
            {{scope.row.main.useCount}}{{scope.row.main.useUnit}}
          </template>
        </el-table-column>
        <el-table-column label="用法/频次" width="100" align="left">
          <template slot-scope="scope">
            {{usage(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="总量" width="80" align="left">
          <template slot-scope="scope">
            {{scope.row.main.quantity}}{{scope.row.main.unit}}
          </template>
        </el-table-column>
      </el-table>
      <div v-else style="color:#A6B2BD;font-size:14px;">没有处方数据</div>
    </div>

    <el-row>
      <el-col :span="8">
        <el-form-item label="医师">
          <span>{{advice.doctorName}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核发药">
          <span>{{advice.checker}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="金额">
          <span>{{advice.total}}</span>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { axios } from "youban-utils";
import qs from "qs";
import utils from "../utils";

export default {
  name: "viewRecipel",
  props: {
    advice: {
      type: Object,
      default() {
        return {};
      },
    },
    elder: {
      type: Object,
      default() {
        return {};
      },
    },
    showNo: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },

  data() {
    return {
      elder: {},
      adviceGroups: {},
      expands: [],
      periods: {
        1: "长嘱",
        2: "临嘱",
      },
    };
  },

  computed: {},
  watch: {},
  mounted() {},
  created() {
    let that = this;
    if (this.advice) {
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/groups/" + this.advice.id,
          null,
          null,
          "get"
        )
        .then((res) => {
          that.adviceGroups = res.data;
          if (that.adviceGroups.length > 0) {
            that.expands = that.adviceGroups.map((item) => item.id);
          }
        });
    }
  },
  methods: {
    ...utils,
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
  },
  components: {},
};
</script>
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
/deep/ .kit-medicine {
  color: #cc66b0;
  padding-left: 16px;
}
</style>
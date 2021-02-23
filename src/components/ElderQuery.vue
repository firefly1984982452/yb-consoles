<template>
  <div class="elder_query">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <slot></slot>
      <div class="search">
        <span>
          <el-select v-model="area" placeholder="请选择" @change="handleQuery">
            <el-option v-for="item in areas" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-if="syncType=='elder'" v-model="nursingLevel" clearable placeholder="请选择护理等级" @change="handleQuery">
            <el-option v-for="item in levels" :key="item.itemValue" :label="item.title" :value="item.itemValue">
            </el-option>
          </el-select>
        </span>
        <span>
          <el-input clearable @clear="handleQuery" :placeholder="syncType=='elder'?'姓名/入院编号':'房间号'" v-model="inputValue" class="input-with-select">
            <el-button style="width:40px;min-width:0;" slot="append" @click="initTableData(true, 1), (currentPage = 1)" icon="el-icon-search"></el-button>
          </el-input>
        </span>
      </div>
      <!-- <Table ref="queryTable" :tableData="tableData" :totalPage="totalPage" :currentPage="currentPage" :selection="selection" :tableHeader="tableHeader" :syncType="syncType" @handlePageChange="handlePageChange" @handleSelect="handleSelect" :boder="false"></Table> -->
      <el-table v-if="syncType=='elder'" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @select="handleOneSelect" @select-all="selectAll">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column label="长者姓名" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.elderName }}</template>
        </el-table-column>
        <el-table-column prop="name" label="房间床位" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.roomName }}-{{ scope.row.bedName }}</template>
        </el-table-column>
        <el-table-column prop="nursingLevel" label="护理等级" align="center">
          <template slot-scope="scope">
            {{ scope.row.nursingLevel | levelFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="区域" align="center">
        </el-table-column>
        <el-table-column prop="checkinNo" label="入院编号" align="center">
        </el-table-column>
      </el-table>
      <el-table v-else ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @select="handleOneSelect" @select-all="selectAll">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="roomName" label="房间床位" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.roomName }}</template>
        </el-table-column>
        <el-table-column prop="areaName" label="区域" align="center">
          <template slot-scope="scope">{{ scope.row.areaName }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span>
          <el-checkbox style="margin-right:0;" v-model="isAllPage" border @change="allCheckEvent">全选所有页</el-checkbox>
          <el-checkbox v-model="isCurrentAll" :indeterminate="isIndeterminate" @change="handleCheckedCitiesChange" border>全选当前页</el-checkbox>
        </span>
        <el-pagination layout="prev, pager, next" :total="totalPage" :current-page.sync="currentPage" @current-change="handlePageChange">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">立即同步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Table from "@/components/Table";
export default {
  props: {
    title: {
      type: String,
      default: "提示",
    },
  },
  name: "ElderQuery",
  data() {
    return {
      tableData: [],
      tableHeader: [],
      dialogVisible: false,
      areas: [{ label: "全部区域", value: "" }],
      levels: [],
      area: "",
      nursingLevel: "",
      inputValue: "",
      currentPage: 1,
      totalPage: 0,
      serviceIds: [],
      selectedData: [],
      multipleSelection: [],
      //   selection: true,
      syncType: "", //同步数据的类型 长者还是房间
      isAllPage: false,
      isCurrentAll: false,
      isIndeterminate: false,
    };
  },
  created() {
    this.getEaras();
    this.getLevel();
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      if (newValue) {
        this.area = "";
        this.inputValue = "";
        this.nursingLevel = "";
        this.currentPage = 1;
        this.isAllPage = this.isCurrentAll = false;
        this.initTableData(true, 1);
      }
    },
    isCurrentAll(val) {
      if (val) {
        this.isAllPage = false;
        this.tableData.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
        this.selectedData = this.tableData.map((item) => {
          item.selected = true;
          return item;
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  methods: {
    initTableData(isPager, pageIndex) {
      const api =
        this.syncType == "elder"
          ? "/elderService/elderInfo"
          : "/elderService/roomInfo";
      const param =
        this.syncType == "elder"
          ? {
              areaId: this.area,
              nursingLevel: this.nursingLevel,
              param: this.inputValue,
              isPager: isPager,
              pageIndex: isPager ? pageIndex : 1,
              pageSize: isPager ? 10 : null,
            }
          : {
              areaId: this.area,
              roomName: this.inputValue,
              isPager: isPager,
              pageIndex: isPager ? pageIndex : 1,
              pageSize: isPager ? 10 : null,
            };
      axios.fetch("careServer", api, param).then((res) => {
        this.tableData = res.data;
        this.totalPage = res.total;
        if (this.isAllPage) {
          let flag = false;
          const firstDataId =
            this.syncType == "elder"
              ? this.tableData[0].elderId
              : this.tableData[0].roomId;
          this.selectedData.forEach((item) => {
            const id = this.syncType == "elder" ? item.elderId : item.roomId;
            if (id === firstDataId) {
              flag = true;
            }
          });
          // 选中过
          if (flag) {
            this.tableData.forEach((data) => {
              let dataId =
                this.syncType == "elder" ? data.elderId : data.roomId;
              this.selectedData.forEach((s) => {
                let sId = this.syncType == "elder" ? s.elderId : s.roomId;
                if (dataId === sId) {
                  data.selected = s.selected;
                }
              });
            });
            console.log(this.tableData, "this.tableData");
            this.$nextTick(() => {
              this.tableData.forEach((row) => {
                if (row.selected) {
                  this.$refs.multipleTable.toggleRowSelection(row, true);
                }
              });
            });
          } else {
            // 没有选中过
            this.$nextTick(() => {
              this.tableData.forEach((row) => {
                this.$refs.multipleTable.toggleRowSelection(row, true);
              });
            });
            this.selectedData = this.selectedData.concat(
              this.tableData.map((item) => {
                item.selected = true;
                return item;
              })
            );
          }
          //   console.log(this.selectedData, "===selectedData");
        } else {
          this.selectedData = [];
        }
      });
    },
    handleQuery() {
      this.currentPage = 1;
      this.isCurrentAll = false;
      this.isAllPage = false;
      this.selectedData = [];
      this.initTableData(true);
    },
    handlePageChange(val, isAllPage) {
      this.currentPage = val;
      this.isCurrentAll = false;
      this.initTableData(true, val);
    },
    handleSubmit() {
      if (this.selectedData.filter((item) => item.selected).length > 0) {
        if (this.isAllPage) {
          this.getAllDatas();
        } else {
          console.log(this.selectedData);
          const ids = [];
          this.selectedData.forEach((item) => {
            if (item.selected) {
              let id = this.syncType == "elder" ? item.elderId : item.roomId;
              ids.push(id);
            }
          });
          const api =
            this.syncType == "elder"
              ? "/elderService/together/elder"
              : "/elderService/together/room";
          const param =
            this.syncType == "elder"
              ? {
                  serviceIds: this.serviceIds,
                  elderIds: ids,
                }
              : {
                  serviceIds: this.serviceIds,
                  roomIds: ids,
                };
          axios.fetch("careServer", api, param, "json").then((res) => {
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message:
                this.syncType == "elder"
                  ? `成功同步${ids.length}位长者数据`
                  : `成功同步${ids.length}个房间数据`,
            });
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要同步的数据",
        });
      }
    },
    requestFn(ids) {
      const api =
        this.syncType == "elder"
          ? "/elderService/together/elder"
          : "/elderService/together/room";
      const param =
        this.syncType == "elder"
          ? {
              elderIds: ids,
              serviceIds: this.serviceIds,
            }
          : {
              roomIds: ids,
              serviceIds: this.serviceIds,
            };
      axios.fetch("careServer", api, param, "json").then((res) => {
        this.$message({
          message:
            this.syncType == "elder"
              ? `成功同步${ids.length}位长者数据`
              : `成功同步${ids.length}个房间数据`,
          type: "success",
        });
        this.dialogVisible = false;
      });
    },
    getLevel() {
      axios
        .fetch("commonServer", "/dict/getItemViewsByGroup", {
          groups: "院方护理等级",
        })
        .then((res) => {
          if (res.code == 200) this.levels = res.data;
        });
    },
    // 获取全部区域
    getEaras() {
      axios
        .fetch("oaServer", "/org/area/list", {
          groups: "楼宇区域",
        })
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.label = item.areaName;
              obj.value = item.areaId;
              this.areas.push(obj);
            });
          }
        });
    },
    // 全选所有页value值变化时
    allCheckEvent(val) {
      this.isCurrentAll = false;
      this.selectedData = [];
      this.isAllPage = val;
      if (this.isAllPage) {
        this.$nextTick(() => {
          this.tableData.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          });
        });
        this.selectedData = this.tableData.map((item) => {
          item.selected = true;
          return item;
        });
      } else {
        this.tableData.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        });
      }
    },
    // 单个选中操作
    handleOneSelect(val, row) {
      // 获取本条数据的id 唯一标识
      const rowId = this.syncType == "elder" ? row.elderId : row.roomId;
      if (this.isAllPage) {
        // 全选所有页时
        this.selectedData.forEach((item) => {
          const id = this.syncType == "elder" ? item.elderId : item.roomId;
          if (id === rowId) {
            item.selected = !item.selected;
          }
        });
        // console.log(this.selectedData);
      } else {
        this.selectedData = val.map((item) => {
          item.selected = true;
          return item;
        });
      }
    },
    // 选中值的变化
    handleSelectionChange(val) {
      // console.log(val);
      if (!this.isAllPage) {
        if (val.length === 0) {
          this.isIndeterminate = false;
          this.isCurrentAll = false;
        } else {
          if (val.length < this.tableData.length) {
            // this.isCurrentAll = true;
            this.isIndeterminate = true;
          } else {
            this.isIndeterminate = false;
            this.isCurrentAll = true;
          }
        }
      }
    },
    // 全选当前页切换
    handleCheckedCitiesChange(value) {
      if (!this.isIndeterminate && this.isCurrentAll) {
        this.tableData.forEach((row) => {
          row.selected = false;
          this.$refs.multipleTable.toggleRowSelection(row, false);
        });
        this.selectedData = this.tableData;
      }
      if (this.isIndeterminate) {
        this.isCurrentAll = true;
        this.isIndeterminate = false;
        this.tableData.forEach((row) => {
          row.selected = true;
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
        this.selectedData = this.tableData;
      }
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate =
      //   checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 全选
    selectAll(rows) {
      // console.log(rows);
      if (!this.isAllPage) {
        if (rows.length > 0) {
          this.isCurrentAll = true;
        } else {
          this.isCurrentAll = false;
        }
      } else {
        if (rows.length === 0) {
          this.selectedData.forEach((item) => {
            const itemId =
              this.syncType == "elder" ? item.elderId : item.roomId;
            this.tableData.forEach((data) => {
              const dataId =
                this.syncType == "elder" ? data.elderId : data.roomId;
              if (itemId === dataId) {
                item.selected = false;
              }
            });
          });
        } else {
          this.selectedData.forEach((item) => {
            const itemId =
              this.syncType == "elder" ? item.elderId : item.roomId;
            this.tableData.forEach((data) => {
              const dataId =
                this.syncType == "elder" ? data.elderId : data.roomId;
              if (itemId === dataId) {
                item.selected = true;
              }
            });
          });
        }
      }
    },
    // 全选所有页时 需要获取所有数据
    getAllDatas() {
      const api =
        this.syncType == "elder"
          ? "/elderService/elderInfo"
          : "/elderService/roomInfo";
      const param =
        this.syncType == "elder"
          ? {
              isPager: false,
              areaId: this.area,
              nursingLevel: this.nursingLevel,
              param: this.inputValue,
            }
          : {
              isPager: false,
              areaId: this.area,
              roomName: this.inputValue,
            };
      axios.fetch("careServer", api, param).then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((data) => {
            let dataId = this.syncType == "elder" ? data.elderId : data.roomId;
            // 默认都时选中状态
            data.selected = true;
            // 然后与selectedData数据对比 如果id相同 selected的值以selectedData中为主
            this.selectedData.forEach((item) => {
              let itemId =
                this.syncType == "elder" ? item.elderId : item.roomId;
              if (dataId === itemId) {
                // console.log(item.selected);
                data.selected = item.selected;
              }
            });
            // 对比完毕后 selectedData取所有数据的值
            this.selectedData = res.data;
          });
          const ids = [];
          // 提交给后台时 筛选出selected为true的id
          this.selectedData.forEach((item) => {
            if (item.selected) {
              let id = this.syncType == "elder" ? item.elderId : item.roomId;
              ids.push(id);
            }
          });
          // 调用同步接口
          const api =
            this.syncType == "elder"
              ? "/elderService/together/elder"
              : "/elderService/together/room";
          const param =
            this.syncType == "elder"
              ? {
                  serviceIds: this.serviceIds,
                  elderIds: ids,
                }
              : {
                  serviceIds: this.serviceIds,
                  roomIds: ids,
                };
          axios.fetch("careServer", api, param, "json").then((res) => {
            this.dialogVisible = false;
            this.$message({
              type: "success",
              message:
                this.syncType == "elder"
                  ? `成功同步${ids.length}位长者数据`
                  : `成功同步${ids.length}个房间数据`,
            });
          });
        }
      });
    },
  },
  components: { Table },
  filters: {
    levelFilter: (val) => {
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
    },
  },
};
</script>

<style lang="less" scoped>
.elder_query {
  /deep/ .el-dialog {
    .el-dialog__body {
      padding: 8px 15px;

      .pagination {
        padding-left: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .tip {
      padding: 0 8px;
      background-color: #f8f8f8;
      height: 44px;
      line-height: 44px;
    }
    .search {
      display: flex;
      span + span {
        margin-left: 10px;
      }
      .el-select {
        width: 150px;
        .el-input {
          width: 100%;
        }
      }
      .el-input__inner {
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
      }
      span:nth-child(2) {
        .el-input__inner {
          width: 180px;
        }
      }
    }
  }
}
</style>

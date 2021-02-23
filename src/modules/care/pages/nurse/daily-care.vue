<template>
  <div class="daily-care">
    <div class="left">
      <el-aside
        style="border-right: 1px solid #eee;width:350px;padding-right:6px"
      >
        <div class="category-header">
          <div class="left">
            <h3>服务内容分类</h3>
          </div>
        </div>
        <div class="categories">
          <draggable
            class=""
            element="ul"
            :list="filterCategories"
            :options="{ group: 'title', animation: 150 }"
            :no-transition-on-drag="true"
            @change="sortChanged"
          >
            <transition-group type="transition">
              <div
                v-for="item in filterCategories"
                :key="item.id"
                class="category"
                :class="{ active: parent.id == item.id }"
                @click="selectCategory(item)"
              >
                <img
                  :src="item.imageUrl ? item.imageUrl : defaultImg"
                  alt="图片"
                />
                <span>{{ item.title }}</span>
                <!-- <el-tag type="success" effect="dark" size="mini">哈哈哈哈</el-tag> -->
                <div class="handle">
                  <span>
                    <i
                      class="iconfont iconcaozuotubiao-bianji"
                      @click="editCate(item)"
                    />
                  </span>
                  <span>
                    <span @click="deleteCate(item)">
                      <i
                        style="font-size:18px"
                        slot="reference"
                        class="el-icon-delete-solid danger"
                      />
                    </span>
                  </span>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
        <div class="footer right">
          <el-button type="primary" icon="el-icon-plus" @click="addCate()"
            >新增类型</el-button
          >
        </div>
      </el-aside>
    </div>
    <div class="mian-content">
      <div class="title">
        <h3>服务内容</h3>
        <div class="hanlde_btn">
          <!-- <el-popover placement="bottom" v-model="visible">
            <div style="text-align: center;">
              <div>
                <el-button size="mini" type="info" plain @click="showDialog('elder')" :disabled="multipleSelection.every(item=>item.targetType!==0)">选择长者任务</el-button>
              </div>
              <div style="margin-top:5px">
                <el-button type="info" size="mini" plain @click="showDialog('room')" :disabled="multipleSelection.every(item=>item.targetType!==1)">选择房间任务</el-button>
              </div>
            </div> -->
          <!-- <el-button slot="reference"> -->
          <el-button @click="showDialog('room')">
            <i class="el-icon-refresh el-icon--left"></i>同步
          </el-button>
          <!-- </el-popover> -->
          <el-button type="primary" @click="addPlan">
            新增
          </el-button>
        </div>
      </div>
      <el-table
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :data="tableData"
        :cell-style="cellStyle"
        border
        :header-cell-style="{ background: '#F3F3F5' }"
        class="ub-table"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column
          label="服务内容"
          prop="itemTitle"
          min-width="80"
        ></el-table-column>
        <!-- <el-table-column v-for="(colum,i) in colums" :label="colum.name" :prop="colum.filed"></el-table-column> -->
        <el-table-column label="执行分类" min-width="70" prop="targetType">
          <template slot-scope="scope">
            <span>{{ scope.row.targetType | targetTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <el-tooltip content="护理员在执行该内容时是否需要手动提交记录" placement="top">
              <span>
                是否执行
                <i class="el-icon-info"></i>
              </span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.schedulable">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="调整排序" min-width="70">
          <template slot-scope="scope">
            <span
              style="cursor:pointer;"
              @click="down(scope.row, scope.$index)"
            >
              <i class="el-icon-bottom"></i>
            </span>
            <span
              style="cursor:pointer;color:#409EFF;"
              @click="up(scope.row, scope.$index)"
            >
              <i class="el-icon-top"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top-end"
            >
              <el-button size="mini" @click="edit(scope.row)"
                ><i class="iconfont iconcaozuotubiao-bianji"></i
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="等级任务配置"
              placement="top-end"
            >
              <el-button size="mini" @click="taskSet(scope.row)"
                ><i class="iconfont iconcaozuotubiao-baocun"
              /></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="护理指标配置"
              placement="top-end"
            >
              <el-button size="mini" @click="addNurseSatandards(scope.row)"
                ><i class="iconfont iconcaozuotubiao-hulizhibiao"
              /></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top-end"
            >
              <el-button size="mini" @click="deleteNursingService(scope.row)"
                ><i class="el-icon-delete-solid"
              /></el-button>
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
      >
      </el-pagination>
    </div>
    <AddProjectDialog
      :type="type"
      @getNursingCategory="getNursingCategory"
      ref="addProjectDialog"
    ></AddProjectDialog>
    <AddContent
      :sign="sign"
      :currentItem="parent"
      ref="addContent"
      @getNursingService="getNursingService"
    ></AddContent>
    <!-- <TaskSet ref="taskSet"></TaskSet> -->
    <TaskSet
      @handleDiaClose="handleDiaClose"
      :currentItem="nurseTask"
      :dialogTableVisible="dialogTableVisible"
    ></TaskSet>
    <NurseStandards ref="nurseStandards"></NurseStandards>
    <!-- 长者查询弹框 -->
    <ElderQuery ref="elderQuery" :title="'同步任务计划'">
      <p class="tip">
        通过同步任务计划功能，可批量更新同步老人现有任务计划，次日生效
      </p>
    </ElderQuery>
  </div>
</template>

<script type="text/javascript">
import draggable from "vuedraggable";
import AddProjectDialog from "./child/addProjectDialog";
import AddContent from "./child/addContent";
import TaskSet from "./child/taskSet";
import NurseStandards from "./child/nurseStandards";
import ElderQuery from "@/components/ElderQuery";
export default {
  name: "DailyCare",
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      visible: false, // 控制同步点击选择长者或者房间
      sign: "add",
      parent: {},
      defaultImg: require("../../../../assets/images/default.png"),
      filterCategories: [],
      searchForm: {
        pageIndex: 1,
        pageSize: 10
      },
      /**-------- */
      currentPage: 1,
      totalPage: 0,
      // 表格数据
      tableData: [],
      // 点击配置护理任务按钮时的那条数据
      nurseTask: {},
      // 控制任务配置弹框的显示与隐藏
      dialogTableVisible: false,
      multipleSelection: []
    };
  },
  watch: {
    type(newValue, oldValue) {
      this.getNursingCategory();
    }
  },
  filters: {
    targetTypeFilter: function(value) {
      return value == 0 ? "按长者" : "按房间";
    }
  },
  components: {
    AddProjectDialog,
    AddContent,
    TaskSet,
    NurseStandards,
    ElderQuery
  },
  created() {
    this.getNursingCategory();
  },
  methods: {
    renderHeader() {
      return (
        <div>
          <el-tooltip
            content="Top Left 提示文字"
            effect="dark"
            placement="bottom"
          >
            是否执行
            <i class="el-icon-information"></i>
          </el-tooltip>
        </div>
      );
    },
    handleDiaClose() {
      this.dialogTableVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取护理项目
    getNursingCategory() {
      axios
        .fetch("careServer", "/nursingCategory/query", {
          type: this.type
        })
        .then(res => {
          this.filterCategories = res.data;
          this.parent =
            this.filterCategories.length > 0 ? this.filterCategories[0] : {};
          if (this.parent.id) {
            this.getNursingService();
            this.currentPage = 1;
          } else {
            this.tableData = [];
            this.totalPage = 0;
            this.searchForm.pageIndex = 1;
          }
        });
    },
    // 获取护理内容
    getNursingService() {
      axios
        .fetch("careServer", "/nursingService/query", {
          type: this.type,
          pageIndex: this.searchForm.pageIndex,
          pageSize: this.searchForm.pageSize,
          categoryId: this.parent.id
        })
        .then(res => {
          this.tableData = res.data;
          this.totalPage = res.total;
          // this.currentPage = 1;
        });
    },
    // 选择护理项目事件
    selectCategory(item) {
      this.parent = item;
      this.searchForm.pageIndex = 1;
      this.getNursingService(item.id);
    },
    // 排序
    sortChanged() {
      let ids = [];
      for (var i in this.filterCategories) {
        ids.push(this.filterCategories[i].id);
      }
      axios
        .fetch("careServer", "/nursingCategory/update/sort", ids, "json")
        .then(res => {
          this.$message.success("排序保存成功");
        });
    },
    /*查询第几页数据*/
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchForm.pageIndex = val;
      this.getNursingService();
    },
    // 编辑父级类型
    editCate(item) {
      this.$refs.addProjectDialog.form = Object.assign({}, item);
      this.$refs.addProjectDialog.dialogFormVisible = true;
    },
    // 添加父级类型
    addCate() {
      this.$refs.addProjectDialog.dialogFormVisible = true;
    },
    // 删除父级项目
    deleteCate(data) {
      this.$confirm(
        "服务内容已被使用，是否要强制删除？<br /><p style='color:red';> 提示：强制删除后，所有护理计划中的此项服务都将被同步删除（次日生效）?</p>",
        "提示",
        {
          confirmButtonText: "强制删除",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .fetch("careServer", "/nursingCategory/delete", {
              id: data.id
            })
            .then(res => {
              if (res.code == 200) {
                this.$message.success("删除成功");
                this.getNursingCategory();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 添加项目保存事件
    handleSaveCate() {
      this.$refs.addProjectDialog.dialogFormVisible = false;
    },
    // 添加服务内容
    addPlan() {
      this.sign = "add";
      this.$refs.addContent.data = [
        {
          itemTitle: "",
          schedulable: true,
          targetType: 0
        }
      ];
      this.$refs.addContent.dialogFormVisible = true;
    },
    showDialog(type) {
      if (this.multipleSelection.length > 0) {
        const firstTargetType = this.multipleSelection[0].targetType;
        const flag = this.multipleSelection.every(item => {
          return item.targetType === firstTargetType;
        });
        console.log(flag);
        if (flag) {
          this.visible = false;
          this.$refs.elderQuery.dialogVisible = true;
          this.$refs.elderQuery.syncType =
            this.multipleSelection[0].targetType === 0 ? "elder" : "room";
          if (this.multipleSelection[0].targetType === 0) {
            this.$refs.elderQuery.serviceIds = [];
            this.multipleSelection.forEach(item => {
              if (item.targetType == 0) {
                this.$refs.elderQuery.serviceIds.push(item.serviceId);
              }
            });
          } else if (this.multipleSelection[0].targetType === 1) {
            if (this.multipleSelection.length > 0) {
              this.$refs.elderQuery.serviceIds = [];
              this.multipleSelection.forEach(item => {
                if (item.targetType == 1) {
                  this.$refs.elderQuery.serviceIds.push(item.serviceId);
                }
              });
            }
          }
        } else {
          this.$message({
            type: "warning",
            message: "请选择执行分类相同的内容进行同步"
          });
        }
      } else {
        this.$message({
          type: "warning",
          message: "请选择需要同步的服务内容"
        });
      }
    },
    //  修改内容
    edit(item) {
      this.sign = "edit";
      this.$refs.addContent.dialogFormVisible = true;
      this.$refs.addContent.lastType = item.targetType;
      this.$refs.addContent.data = JSON.parse(JSON.stringify([item]));
    },
    // 删除护理服务项目内容
    deleteNursingService(data) {
      this.$confirm(
        "服务内容已被使用，是否要强制删除？<br /><p style='color:red';> 提示：强制删除后，所有护理计划中的此项服务都将被同步删除（次日生效）?</p>",
        "提示",
        {
          confirmButtonText: "强制删除",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          axios
            .fetch("careServer", "/nursingService/delete", {
              serviceId: data.serviceId
            })
            .then(res => {
              if (res.code == 200) {
                this.getNursingService();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 点击等级任务配置按钮
    taskSet(data) {
      this.nurseTask = data;
      this.dialogTableVisible = true;
    },
    // 添加护理指标
    addNurseSatandards(data) {
      axios
        .fetch("careServer", "/nursingOption/query", {
          serviceId: data.serviceId
        })
        .then(res => {
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              item.dynamicTags = item.inputText
                ? item.inputText.split(",")
                : [];
              item.inputVisible = false;
              item.inputValue = "";
            });
            this.$refs.nurseStandards.model.tableData = JSON.parse(JSON.stringify(res.data));
          } else {
            this.$refs.nurseStandards.model.tableData = [
              {
                name: "",
                inputType: "",
                inputText: "",
                dispIndex: 0,
                dynamicTags: [],
                inputVisible: false,
                inputValue: ""
              }
            ];
          }
          this.$refs.nurseStandards.currentItem = data;
          this.$refs.nurseStandards.dialogTableVisible = true;
        });
    },
    // 排序函数
    async sortFn(param) {
      const res = await axios.fetch(
        "careServer",
        "/nursingService/update/sort",
        param
      );
      if (res.code == 200) {
        this.$message.success("操作成功");
        this.getNursingService();
      }
    },
    // 向下排序
    /**
     * 找不到下一条的情况有两种
     * 1 currentPage < totalPage时 说明是当前页的最后一条 需要查找下一页的第一条
     * 2 currentPage = totalPage时 说明是全部数据的最后一条
     */
    down(data, index) {
      const nextIndex = index + 1;
      const nextData = this.tableData[nextIndex];
      const totalPage = Math.ceil(this.totalPage / this.searchForm.pageSize);

      // if (this.currentPage == totalPage) {
      if (nextData) {
        const param = {
          oneServiceId: data.serviceId,
          oneDispIndex: data.dispIndex,
          twoServiceId: nextData.serviceId,
          twoDispIndex: nextData.dispIndex
        };
        this.sortFn(param);
      } else {
        // 找不到下一条数据时
        if (this.currentPage == totalPage) {
          // currentPage = totalPage时
          // 说明是最后一条
          this.$message.warning("已经是最后一条数据");
        } else {
          // 需要去找下一页的第一条
          axios
            .fetch("careServer", "/nursingService/query", {
              type: this.type,
              pageIndex: this.searchForm.pageIndex + 1,
              pageSize: this.searchForm.pageSize,
              categoryId: this.parent.id
            })
            .then(res => {
              const param = {
                oneServiceId: data.serviceId,
                oneDispIndex: data.dispIndex,
                twoServiceId: res.data[0].serviceId,
                twoDispIndex: res.data[0].dispIndex
              };
              this.sortFn(param);
            });
        }
      }
      // }
    },
    // 向上排序
    up(data, index) {
      // 总页数
      const totalPage = Math.ceil(this.totalPage / this.searchForm.pageSize);
      const lastData = this.tableData[index - 1];
      if (!lastData) {
        // 没有找到上一条的情况
        if (this.currentPage == 1) {
          this.$message.warning("已经是第一条数据");
        } else {
          // 需要去找上一页的最后
          axios
            .fetch("careServer", "/nursingService/query", {
              type: this.type,
              pageIndex: this.searchForm.pageIndex - 1,
              pageSize: this.searchForm.pageSize,
              categoryId: this.parent.id
            })
            .then(res => {
              const param = {
                oneServiceId: data.serviceId,
                oneDispIndex: data.dispIndex,
                twoServiceId: res.data[this.searchForm.pageSize - 1].serviceId,
                twoDispIndex: res.data[this.searchForm.pageSize - 1].dispIndex
              };
              this.sortFn(param);
            });
        }
      } else {
        const param = {
          oneServiceId: data.serviceId,
          oneDispIndex: data.dispIndex,
          twoServiceId: lastData.serviceId,
          twoDispIndex: lastData.dispIndex
        };
        this.sortFn(param);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.daily-care {
  display: flex;
  .left {
    // width: 350px;
  }
  .mian-content {
    overflow: auto;
    flex: 1;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0 0 12px;
      height: 56px;
    }
  }
}
</style>
<style scoped>
.category {
  background-color: rgba(241, 244, 245, 1);
  margin: 4px 4px 4px 0px;
  padding: 6px;
  border-radius: 4px;
  font-size: 14px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.category img {
  display: inline-block;
  width: 48px;
  height: 48px;
}
.active {
  background-color: rgba(142, 194, 255, 1);
}
/deep/ .el-input-group__append {
  padding: 0px;
}
.category-header {
  margin-top: 8px;
  /* padding-bottom: 4px; */
  /* margin-bottom: 16px; */
  border-bottom: 1px solid #eeeeee;
  height: 32px;
}
.category-header .left {
  float: left;
}
.category-header .right {
  display: inline-block;
  margin-top: -4px;
}
/deep/ .category-header .el-input__inner {
  border: none;
}
.categories {
  height: 430px;
  border-bottom: 1px solid #eeeeee;
  overflow: auto;
}
/deep/ .el-input-group__append button {
  width: 60px;
  min-width: 60px;
  padding: 0px;
  margin: 0px;
}
</style>

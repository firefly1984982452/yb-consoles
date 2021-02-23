<template>
  <div class="bind_bed">
    <el-drawer :visible.sync="visible" direction="rtl" size="30%" :before-close="handleCancel">
      <p class="drawer__header">
        新增/编辑房间绑定
      </p>
      <div class="drawer__content">
        <el-form class="form" label-width="70px" :model="form" ref='form'>
          <el-form-item label="人员" prop="employeeId">
            <ub-employee v-if="asign=='edit'" v-model="form.employeeId" @change="changePeople()" :disabled="asign=='edit'"></ub-employee>
            <el-select filterable v-else v-model="form.employeeId" @change="changePeople()">
              <el-option v-for="item in options" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId">
                <span class="name">{{ item.employeeName }}</span>
                <span class="title" v-if="item.jobName">{{ `${item.jobName}/${item.deptName}` }}</span>
                <span class="title" v-else>{{ `${item.deptName}` }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域" prop="checkedAreas">
            <el-checkbox-group v-model="form.checkedAreas" @change="changeFloor">
              <el-checkbox v-for="(item,index) in areas" :disabled="areaList.length==0?true:item.disabled" :key="index" :label="item.text"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="bed_list" v-if="roomList.length > 0">
          <div v-for="(room,roomIndex) in roomList">
            <el-checkbox v-show="room.show" :indeterminate="room.isIndeterminate" v-model="room.checkAll" @input="handleCheckAllChange(room.checkAll,roomIndex)">{{room.roomName}}</el-checkbox>
            <div v-show="room.show" style="margin: 15px 0;"></div>
            <el-checkbox-group v-show="room.show" v-model="room.checkedBeds" @change="handleBedChange(room,roomIndex)">
              <el-checkbox v-for="bed in room.elderInfoVos" :label="bed" :key="bed.bedId">
                <span v-if="bed.elderId">
                  {{ bed.elderName}}
                </span>
                <span v-else-if="bed.bedId">
                  {{ bed.bedName}}号床
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="drawer__footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSave" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script type="text/javascript">
import ubEmployee from "@/components/employee";
export default {
  name: "BindBed",
  props: {
    asign: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      visible: false,
      form: {
        employeeId: "",
        checkedAreas: [],
      },
      options: [],
      areas: [],
      areaList: [],
      roomList: [],
      // roomLoading: false,
      loading: false,
    };
  },
  watch: {
    visible: {
      deep: true,
      handler(newName, oldName) {
        if (newName && this.asign == "edit") {
          this.changePeople();
        }
        if (newName) {
          this.getEmployees();
        }
      },
    },
    // roomList: {
    //   deep: true,
    //   handler(newName, oldName) {
    //     if (this.asign == "edit") {
    //       // this.changePeople();
    //       console.log(newName);
    //     }
    //   },
    // },
  },
  created() {
    this.getEaras();
    this.getEmployees();
  },
  methods: {
    // 选择员工事件
    changePeople() {
      this.areaList = [];
      this.getRoomsName(this.form.employeeId);
    },
    // 获取全部区域
    getEaras() {
      axios
        .fetch("oaServer", "/org/area/list", { groups: "楼宇区域" })
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((item) => {
              const obj = {};
              obj.text = item.areaName;
              obj.value = item.areaId;
              this.areas.push(obj);
            });
          }
        });
    },
    // 职责关系查询未绑定员工
    getEmployees() {
      axios.fetch("oaServer", "/employee/info").then((res) => {
        this.options = res.data;
      });
    },
    // 区域变化事件
    // changeFloor(val) {
    //   console.log(val);
    //   if (val.length > 0) {
    //     let roomList = [];
    //     val.forEach((value) => {
    //       let res = this.areaList.filter((item) => {
    //         return value == item.area;
    //       });

    //       roomList.push(...res[0].resultRoomsVos);
    //       roomList.forEach((val) => {
    //         console.log(val);
    //         if (this.asign == "edit") {
    //           val.checkedBeds = val.elderInfoVos.filter((item) => {
    //             return item.isBind;
    //           });
    //         } else {
    //           val.checkedBeds = val.checkedBeds ? val.checkedBeds : [];
    //         }
    //         if (val.checkedBeds.length == 0) {
    //           val.checkAll = false;
    //           val.isIndeterminate = false;
    //         } else {
    //           if (val.checkedBeds == val.elderInfoVos) {
    //             val.checkAll = true;
    //             val.isIndeterminate = false;
    //           } else {
    //             val.checkAll = false;
    //             val.isIndeterminate = true;
    //           }
    //         }
    //       });
    //     });
    //     this.roomList = [...roomList];
    //     console.log(this.roomList);
    //   } else {
    //     this.roomList = [];
    //   }
    // },
    //
    changeFloor(checks) {
      this.roomList = [];
      this.areaList.forEach((item) => {
        item.resultRoomsVos.forEach((res) => {
          res.area = item.area;
        });
        this.roomList.push(...item.resultRoomsVos);
      });
      this.roomList.forEach((val) => {
        val.show = false;
        if (this.asign == "edit") {
          val.checkedBeds = val.elderInfoVos.filter((item) => {
            return item.isBind;
          });
        } else {
          val.checkedBeds = val.checkedBeds ? val.checkedBeds : [];
        }
        if (val.checkedBeds.length == 0) {
          val.checkAll = false;
          val.isIndeterminate = false;
        } else {
          if (val.checkedBeds.length == val.elderInfoVos.length) {
            val.checkAll = true;
            val.isIndeterminate = false;
          } else {
            val.checkAll = false;
            val.isIndeterminate = true;
          }
        }
      });
      this.roomList.forEach((room) => {
        checks.forEach((check) => {
          if (check == room.area) {
            room.show = true;
          }
        });
      });
    },
    // 获取房间
    getRoomsName(val) {
      // this.roomLoading = true;
      let param = {
        employeeId: val,
      };
      axios.fetch("oaServer", "/employee/roomNames", param).then((res) => {
        if (res.code == 200) {
          this.roomLoading = false;
          this.areaList = [...res.data];
          const areas = [];
          this.areaList.forEach((item) => {
            areas.push(item.area);
          });
          this.areas.forEach((area) => {
            if (areas.includes(area.text)) {
              area.disabled = false;
            } else {
              area.disabled = true;
            }
          });
          // console.log(this.areas, "=======this.areas");
          if (this.asign == "edit") {
            this.form.checkedAreas.forEach((item) => {
              this.areaList.forEach((o) => {
                if (item == o.area) {
                  o.resultRoomsVos.forEach((j) => {
                    j.checkedBeds = j.elderInfoVos.filter((e) => {
                      return e.isBind;
                    });
                    j.show = true;
                    if (j.checkedBeds.length == 0) {
                      j.checkAll = false;
                      // j.isIndeterminate = true;
                    } else {
                      if (j.checkedBeds.length == j.elderInfoVos.length) {
                        j.isIndeterminate = false;
                        j.checkAll = true;
                      } else {
                        j.isIndeterminate = true;
                      }
                    }
                    this.roomList.push(j);
                  });
                }
              });
            });
          }
          // console.log(this.areaList, "=====this.areaList");
        }
      });
    },
    // 处理全选事件
    handleCheckAllChange(val, roomIndex) {
      if (val) {
        this.$set(
          this.roomList[roomIndex],
          "checkedBeds",
          this.roomList[roomIndex].elderInfoVos
        );
        this.$set(this.roomList[roomIndex], "checkAll", true);
      } else {
        this.$set(this.roomList[roomIndex], "checkedBeds", []);
        this.$set(this.roomList[roomIndex], "checkAll", false);
      }
      this.$set(this.roomList[roomIndex], "isIndeterminate", false);
      this.$set(this.roomList, roomIndex, this.roomList[roomIndex]);
    },
    // 单个选择事件
    handleBedChange(data, roomIndex) {
      if (data.checkedBeds == 0) {
        this.$set(this.roomList[roomIndex], "checkAll", false);
        this.$set(this.roomList[roomIndex], "isIndeterminate", false);
      } else {
        if (data.elderInfoVos.length == data.checkedBeds.length) {
          this.$set(this.roomList[roomIndex], "isIndeterminate", false);
          this.$set(this.roomList[roomIndex], "checkAll", true);
        } else {
          this.$set(this.roomList[roomIndex], "checkAll", false);
          this.$set(this.roomList[roomIndex], "isIndeterminate", true);
        }
      }
      this.$set(this.roomList, roomIndex, this.roomList[roomIndex]);
      // console.log(this.roomList[roomIndex]);
    },
    // save
    handleSave() {
      
      if (!this.form.employeeId) {
        this.$message.warning("请选择人员");
        return;
      }
      if (this.asign == "add" && this.form.checkedAreas.length == 0) {
        this.$message.warning("请选择区域");
        return;
      } else {
        const checked = [];
        const param = [];
        // console.log( this.roomList,'=====d');
        this.roomList.forEach((room) => {
          if (room.show) {
            const arr = room.checkedBeds.map((val) => {
              // console.log(val,'======val');
              // val.roomId = room.roomId;
              return val;
            });
            checked.push(...arr);
          }
        });
        checked.forEach((check) => {
          // console.log(check);
          const obj = {};
          obj.bedId = check.bedId;
          obj.employeeId = this.form.employeeId;
          obj.bingSave = this.asign == "add" ? 1 : 2;
          obj.buildingId = check.buildingId;
          // obj.roomId = check.roomId;
          param.push(obj);
        });
        // console.log(param);
        if (param.length > 0) {
          axios
            .fetch("oaServer", "/employee/elderBed/bind/save", param, "json")
            .then((res) => {
              if (res.code == 200) {
                this.$message.success("操作成功");
                // this.$router.back();
                this.handleCancel();
                this.$emit("getdata");
              }
            });
        } else {
          this.$message.warning("请选择需要绑定的床位");
          return;
        }
      }
    },
    // cancel
    handleCancel() {
      this.visible = false;
      this.form = {
        employeeId: "",
        checkedAreas: [],
      };
      this.roomList = [];
      this.areaList = [];
    },
  },
  components: { ubEmployee },
};
</script>

<style lang="less" scoped>
.el-form-item {
  margin-bottom: 12px;
}
/deep/ .el-drawer__body {
  height: 100%;
  overflow: auto;
}
.el-checkbox {
  margin-right: 15px;
}
.bed_list {
  max-height: 580px;
  padding: 0 0 0 25px;
  overflow: auto;
  > div {
    margin: 15px 10px;
  }
}
.drawer__header {
  line-height: 44px;
  position: absolute;
  top: 14px;
  left: 25px;
}
.drawer__footer {
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
}
.name {
  float: left;
  width: 80px;
}
.title {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
</style>

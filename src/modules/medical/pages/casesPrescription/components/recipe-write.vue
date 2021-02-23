<template>
  <div>
    <div class="content">
      <el-row type="flex" class="pannel">
        <el-col class="left">
          <el-button type="primary" @click="addGroup()" icon="el-icon-plus"
            >药物</el-button
          >
          <el-button-group v-show="adviceGroups.length > 0">
            <el-button
              type="success"
              icon="el-icon-check"
              plain
              @click="GroupDeal('add')"
              >同组</el-button
            >
            <el-button
              type="info"
              icon="el-icon-close"
              plain
              @click="GroupDeal('reduce')"
              >拆组</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              @click="delGroup()"
              >删除</el-button
            >
          </el-button-group>
        </el-col>
        <el-col class="right">
          <el-button
            type="primary"
            icon="el-icon-s-promotion"
            @click="updateStatu()"
            >发送处方</el-button
          >
        </el-col>
      </el-row>

      <div style="overflow:hidden;">
        <el-table
          :data="adviceGroups"
          style="margin-left:-48px;"
          class="ub-table"
          border
          ref="adviceTable"
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
                @expand-change="expandSelect"
                v-if="props.row.itemCount > 1"
              >
                <el-table-column width="30"> </el-table-column>
                <el-table-column label="组号" width="30">
                  <template slot-scope="scope">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="同组置顶"
                      placement="bottom"
                    >
                      <i
                        class="iconfont iconzhiding"
                        @click="setTop(props.$index, scope.$index)"
                      ></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="组" width="30">
                  <template slot-scope="scope">
                    <span v-if="scope.$index == props.row.items.length - 1"
                      >┗</span
                    ><span v-else>┃</span>
                  </template>
                </el-table-column>
                <el-table-column label="内容" align="left" width="200">
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column label="规格" align="left" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.standard }}
                  </template>
                </el-table-column>
                <el-table-column label="*单次剂量" width="150">
                  <template slot-scope="scope">
                    <el-input
                      style="width: 70px;"
                      maxlength="10"
                      v-model="scope.row.useCount"
                      v-show="scope.row.useCount !== -1"
                      @input="changeSelect(props.$index)"
                      size="mini"
                      placeholder="请输入"
                    ></el-input>
                    <el-select
                      style="width: 60px;"
                      v-model="scope.row.useUnit"
                      @input="changeSelectUnit(props.$index, scope.$index)"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option-group
                        v-for="group in optionsUnit1"
                        :key="group.label"
                        :label="group.label"
                      >
                        <el-option
                          v-for="item in group.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="*用法" width="150"> </el-table-column>
                <el-table-column label="*频率" width="150"> </el-table-column>
                <el-table-column label="用药时间" width="100">
                </el-table-column>
                <el-table-column label="天数" width="60"> </el-table-column>
                <el-table-column label="*总量" width="150">
                  <template slot-scope="scope">
                    <el-input
                      maxlength="10"
                      style="width: 70px;"
                      v-model.number="scope.row.quantity"
                      @input="changeSelect(props.$index)"
                      size="mini"
                      placeholder="请输入"
                    ></el-input>
                    <el-select
                      style="width: 70px;"
                      v-model="scope.row.unit"
                      @input="changeSelect(props.$index)"
                      size="mini"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in optionsUnitSum"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="来源" width="50">
                  <template slot-scope="scope">
                    {{ scope.row.source | filterSource }}
                  </template>
                </el-table-column>
                <el-table-column label="嘱托备注"> </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column width="30">
            <template slot-scope="scope">
              <div>
                <el-checkbox
                  v-model="scope.row.isSelected"
                  @change="changeSelect(scope.$index)"
                ></el-checkbox>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="组号" width="30">
            <template slot-scope="scope">
              <p>{{ scope.$index + 1 }}</p>
            </template>
          </el-table-column>
          <el-table-column label="组" width="30">
            <template slot-scope="scope">
              <span v-if="scope.row.items">┏</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" align="left" width="200">
            <template slot-scope="scope">
              {{ scope.row.main.name }}
            </template>
          </el-table-column>
          <el-table-column label="规格" align="left" width="150">
            <template slot-scope="scope">
              {{ scope.row.main.standard }}
            </template>
          </el-table-column>
          <el-table-column label="*单次剂量" width="150">
            <template slot-scope="scope">
              <el-input
                maxlength="10"
                style="width: 70px;"
                v-show="scope.row.main.useCount !== -1"
                v-model="scope.row.main.useCount"
                @input="changeSelect(scope.$index)"
                size="mini"
                placeholder="请输入"
              ></el-input>
              <el-select
                style="width: 60px;"
                v-model="scope.row.main.useUnit"
                @input="changeSelectUnit(scope.$index)"
                size="mini"
                placeholder="请选择"
              >
                <el-option-group
                  v-for="group in optionsUnit1"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="*用法" width="150">
            <template slot-scope="scope">
              <el-select
                style="width: 140px;"
                v-model="scope.row.way"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsWays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="*频率" width="150">
            <template slot-scope="scope">
              <el-select
                style="width: 140px;"
                v-model="scope.row.rate"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsRates"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="用药时间" width="100">
            <template slot-scope="scope">
              <el-select
                style="width: 70px;"
                @change="changeSelect(scope.$index)"
                v-model="scope.row.useTime"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsTimes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="天数" width="60">
            <template slot-scope="scope">
              <el-input
                maxlength="4"
                style="width: 50px;"
                v-model.number="scope.row.day"
                @input="changeSelect(scope.$index)"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="*总量" width="150">
            <template slot-scope="scope">
              <el-input
                maxlength="10"
                style="width: 70px;"
                @input="changeSelect(scope.$index)"
                v-model.number="scope.row.main.quantity"
                size="mini"
                placeholder="请输入"
              ></el-input>
              <el-select
                style="width: 70px;"
                @input="changeSelect(scope.$index)"
                v-model="scope.row.main.unit"
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in optionsUnitSum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="来源" width="50">
            <template slot-scope="scope">
              {{ scope.row.main.source | filterSource }}
            </template>
          </el-table-column>
          <el-table-column label="嘱托备注">
            <template slot-scope="scope">
              <el-input
                style="width: 100px;"
                v-model="scope.row.useRemark"
                size="mini"
                maxlength="20"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :visible.sync="medicineVisile"
      v-if="medicineVisile"
      :close-on-click-modal="false"
      append-to-body
      show-close="false"
    >
      <medicine
        @handleClose="handleClose"
        @getMedicine="getMedicine"
        :medicineVisile="medicineVisile"
        :tableExistData="tableExistList"
      ></medicine>
    </el-dialog>
  </div>
</template>

<script>
import medicine from "./medicine";
export default {
  components: {
    medicine
  },
  data() {
    return {
      adviceGroups: [],
      expands: [],

      // 单次剂量的单位
      optionsUnit1: [
        {
          label: "剂量单位",
          options: []
        },
        {
          label: "制剂单位",
          options: []
        },
        {
          label: "其他",
          options: [
            {
              value: "适量",
              label: "适量"
            },
            {
              value: "2",
              label: "自定义"
            }
          ]
        }
      ],

      // 总量的单位
      optionsUnitSum: [],

      // 用法列表
      optionsWays: [],

      // 频率列表
      optionsRates: [],

      // 用药时间列表
      optionsTimes: [],

      medicineVisile: false,
      tableExistList: [], // 已经存在列表的所有ID
      elderId: "",
      id: "",
      sign: ""
    };
  },
  props: {
    statu: "",
    adviceId: "",
    activeName: "",
    dynamicTags: {
      type: Array,
      default: []
    },
    advice: {
      type: Object,
      default: {}
    }
  },
  watch: {
    activeName(newValue) {
      // this.id = localStorage.getItem("id") || this.$route.query.id;
      // // console.log(this.clinicId,'=====');
      // if (this.id) {
      //   this.statu = this.$route.query.sign;
      //   this.queryDetail(this.clinicId, "copy");
      //   // this.$message.warning("修改");
      //   console.log("修改");
      // } else {
      //   this.sign = "add";
      // }
      this.initFormData();
    }
  },
  created() {},
  mounted() {
    this.elderId = this.$route.query.elderId;
    // if (this.statu === "add") {
    this.getOption();
    // }
    // if (this.adviceId) {
    //   this.statu = this.$route.query.sign ? this.$route.query.sign : "update";
    //   this.getdata();
    // } else {
    //   this.statu = "add";
    // }
    this.initFormData();
    // this.updatePage(this.advice.items);
  },
  methods: {
    // 回显table 数据
    initFormData() {
      console.log(this.adviceId, "===id");
      this.sign = this.$route.query.sign;
      if (this.adviceId) {
        // this.queryDetail(this.adviceId);
        this.getdata(this.adviceId);
        if (this.sign == "add") {
          this.sign = "edit";
        }
        // this.$message.warning("修改");
      } else {
        if (this.$route.query.id) {
          // this.queryDetail(this.$route.query.id);
          this.getdata(this.$route.query.id);
        }
      }
    },
    // 获取配置项
    getOption() {
      axios
        .fetch(
          "medicalServer",
          "/api/advice/excute/medicine-units",
          null,
          null,
          "get"
        )
        .then(res => {
          // 剂量
          this.optionsUnit1[0].options = res.data.minUnits.map(val => {
            return {
              label: val,
              value: val
            };
          });
          // 制剂
          this.optionsUnit1[1].options = res.data.useUnits.map(val => {
            return {
              label: val,
              value: val
            };
          });
          // 总量的单位
          this.optionsUnitSum = res.data.packageUnits.map(val => {
            return {
              label: val,
              value: val
            };
          });
        });

      axios
        .fetch("medicalServer", "/api/advice/options", null, null, "get")
        .then(res => {
          // 用法列表
          this.optionsWays = res.data.ways.map(val => {
            return {
              label: val.name + "(" + val.remark + ")",
              value: val.name + "(" + val.remark + ")"
            };
          });
          // 频率列表
          this.optionsRates = res.data.rates.map(val => {
            return {
              label: val.name + "(" + val.remark + ")",
              value: val.name + "(" + val.remark + ")"
            };
          });
          // 用药时间列表
          this.optionsTimes = res.data.times.map(val => {
            return {
              label: val.name + "(" + val.remark + ")",
              value: val.name + "(" + val.remark + ")"
            };
          });
        });
    },

    // 获取详情数据
    getdata(id) {
      axios
        .fetch(
          "medicalServer",
          "/api/admin/advice/groups/" + id,
          null,
          null,
          "get"
        )
        .then(res => {
          this.updatePage(res.data);
        });
    },

    // 双表格配置
    expandSelect(row, expandedRows) {
      console.log(row);
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

    // 更新行 - 勾选选择框或输入内容
    changeSelect(index) {
      console.log(index, this.adviceGroups);
      this.$set(this.adviceGroups, index, this.adviceGroups[index]);
      this.$forceUpdate();
    },

    // 更新行 - 单次剂量单位
    changeSelectUnit(index, i) {
      console.log(index, this.adviceGroups, i);
      if (i !== undefined) {
        if (this.adviceGroups[index].items[i].useUnit === "适量") {
          this.adviceGroups[index].items[i].useCount = -1;
        } else {
          this.adviceGroups[index].items[i].useCount = this.adviceGroups[index].items[i].useCount == -1 ? 0 : this.adviceGroups[index].items[i].useCount;
        }
      } else if (this.adviceGroups[index].main.useUnit === "适量") {
        this.adviceGroups[index].main.useCount = -1;
      } else {
        this.adviceGroups[index].main.useCount = this.adviceGroups[index].main.useCount == -1 ? 0 : this.adviceGroups[index].main.useCount;
      }
      this.$set(this.adviceGroups, index, this.adviceGroups[index]);
      this.$forceUpdate();
    },

    // 置顶 - 同组置顶
    setTop(index, i) {
      /**
       * 置顶逻辑
       *
       * 先将主药临时存储
       * 再将主药设为要替换的子药对象
       * 再将子药删除
       * 再将本来的主药添加到子药组的最后一位
       */
      let tempObj = this.adviceGroups[index].main;

      this.adviceGroups[index].main = this.adviceGroups[index].items[i];
      this.adviceGroups[index].items.splice(i, 1);
      this.adviceGroups[index].items.push(tempObj);
      console.log(this.adviceGroups, index, i);
      // 将子药的值置空
      this.adviceGroups[index].way = "";
      this.adviceGroups[index].rate = "";
      this.adviceGroups[index].useTime = "";
      this.adviceGroups[index].day = '';
      this.adviceGroups[index].useRemark = "";
    },

    // 删除组
    delGroup() {
      console.log(
        this.adviceGroups.filter(val => val.isSelected === true).length === 0
      );
      if (
        this.adviceGroups.filter(val => val.isSelected === true).length === 0
      ) {
        return this.$message.error("您当前未选择任何药物！");
      }
      this.adviceGroups = this.adviceGroups.filter(
        val => val.isSelected === false
      );
    },

    // 同组拆组处理
    GroupDeal(type) {
      // 是否相同类型 - 选择的项是否有子药
      let isSameTypeArr = this.adviceGroups.map(val => {
        console.log(val.isSelected);
        if (val.isSelected) {
          let _length = val.items ? true : false;
          return _length;
        }
      });
      // 已经是组的个数
      let isSameType1 = isSameTypeArr.filter(v => v === true).length;
      let isSameType2 = isSameTypeArr.filter(v => v === false).length;

      console.log(isSameType1, isSameType2);
      if (isSameType1 === 0 && isSameType2 === 0) {
        return this.$message.error(`您当前未选择任何药物！`);
      }
      switch (type) {
        case "add":
          if (isSameType1 >= 2) {
            return this.$message.error(
              `您当前选择了${isSameType1}个同组，不可将多个组合并！`
            );
          } else if (isSameType2 === 1 && isSameType1 == 0) {
            return this.$message.error(`您当前只选择1个药，无法与其它药合并！`);
          } else {
            this.combinedGroup(isSameTypeArr);
          }
          break;
        case "reduce":
          this.openGroup(isSameTypeArr);
          break;

        default:
          break;
      }
    },

    // 同组 - 将非组加在已经是组的后面
    combinedGroup(isSameTypeArr) {
      console.log(isSameTypeArr);
      // 先找到是否有主药组
      let hasMainGroup = isSameTypeArr.indexOf(true);
      if (hasMainGroup !== -1) {
        /**
         * 同组逻辑 - 已有一个是同组
         *
         * 先push到组的最后一个，再删除原来的位置
         *
         */

        // 合并
        isSameTypeArr.forEach((val, index) => {
          if (val === false) {
            this.adviceGroups[hasMainGroup].items.push(
              this.adviceGroups[index].main
            );
          }
        });

        this.adviceGroups[hasMainGroup].isSelected = false;

        // 删除
        this.delGroup();
      } else {
        /**
         * 同组逻辑 - 各个单支药
         *
         * 1. 没有主药组则合并为1个
         * 2. 先push到同一个组，再删除原来的所有药
         * 3. 再把刚刚组合的组放到数组最前面
         *
         */

        // 先合并
        let arr = [];
        isSameTypeArr.forEach((val, index) => {
          if (val === false) {
            arr.push(this.adviceGroups[index]);
          }
        });

        // 合并为一个同组
        let list = JSON.parse(JSON.stringify(arr));
        list = list.map((val, index) => {
          if (index === 0) {
            val.isSelected = false;
            val.itemCount = list.length;
            val.items = [];
          } else {
            list[0].items.push(val.main);
          }
          return val;
        });

        // 删除原来的
        this.delGroup();

        // 添加到第一个
        list.length = 1;
        this.adviceGroups.unshift(list[0]);

        // 添加的数据及时通知页面更新
        this.updatePage(this.adviceGroups);
      }
    },

    // 拆组
    openGroup(isSameTypeArr) {
      console.log(isSameTypeArr);
      /**
       * 拆组逻辑
       *
       * 1. 如果有单药和组合药都选择的，
       * 2. 直接释放单个药
       * 3. 将组合药拆分
       * 4. 将拆分出来的单药的值置空
       * 5. 将拆分的药放在它本来组的位置
       */

      let _length = this.adviceGroups.length;
      for (var index = 0; index < _length; index++) {
        console.log(
          index,
          _length,
          this.adviceGroups,
          this.adviceGroups[index]
        );
        var val = this.adviceGroups[index].isSelected;

        if (val === true) {
          this.adviceGroups[index].isSelected = false;
          if (this.adviceGroups[index].items) {
            this.adviceGroups[index].items.forEach((v, i) => {
              console.log(index, i);
              let item = JSON.parse(JSON.stringify(this.adviceGroups[index]));
              item.items = null;

              // 将子药的值置空
              // v.useCount = 0;
              // v.useUnit = "";
              // v.quantity = 0;
              // v.unit = "";
              item.way = "";
              item.rate = "";
              item.useTime = "";
              item.day = '';
              item.useRemark = "";

              item.main = v;
              item.itemCount = 1;
              this.adviceGroups.splice(index + 1 + i, 0, item);
              this.adviceGroups[index].itemCount = 1;
              this.adviceGroups[index].items = null;
              ++index;
              ++_length;
            });
          }
        }
      }
      // 更新DOM
      this.$nextTick(() => {
        this.$set(
          this,
          "adviceGroups",
          JSON.parse(JSON.stringify(this.adviceGroups))
        );
        this.$forceUpdate();
      });
    },

    // 更新页面
    updatePage(data) {
      console.log(data, "====data");
      if (!this.adviceId) {
        delete data.id;
        delete data.adviceNo;
        delete data.doctorId;
        delete data.doctorName;
        delete data.status;
      }
      this.adviceGroups = JSON.parse(JSON.stringify(data));
      if (this.adviceGroups.length > 0) {
        this.adviceGroups = this.adviceGroups.map(val => {
          if (val.main.useCount === undefined && val.main.useUnit) {
            if (val.main.useUnit === "适量") {
              val.main.useCount = -1;
            } else {
              val.main.useCount = JSON.parse(JSON.stringify(val.main.useUnit));
              val.main.useUnit = "2";
            }
          }
          if (val.items) {
            val.items = val.items.map(v => {
              if (v.useCount === undefined && v.useUnit) {
                if (v.useUnit === "适量") {
                  v.useCount = -1;
                } else {
                  v.useCount = JSON.parse(JSON.stringify(v.useUnit));
                  v.useUnit = "2";
                }
              }
              return v;
            });
          }
          val.isSelected = false;
          return val;
        });
        this.expands = this.adviceGroups.map(item => item.id);
      }
      console.log(this.adviceGroups);
    },

    // 添加药物
    addGroup() {
      this.tableExistList = this.adviceGroups
        .map(val => {
          let childArr = val.items
            ? val.items.map(v => `${v.medicineId}-${v.source}`)
            : [];
          return [`${val.main.medicineId}-${val.main.source}`, ...childArr];
        })
        .flat();
      console.log(this.tableExistList);
      this.$nextTick(() => {
        this.medicineVisile = true;
      });
    },

    // 修改
    updateStatu() {
      console.log(this.adviceGroups);
      // 判断是新增还是修改
      // this.adviceId = localStorage.getItem("clinicId") || this.$route.query.id;
      // 判断是新增还是修改
      // let initType = "add";
      // if (this.adviceId) {
      //   initType = this.$route.query.sign ? this.$route.query.sign : "update";
      // }

      // let dynamicTags = window.localStorage.getItem("dynamicTags");
      console.log(this.dynamicTags);
      if (this.dynamicTags.length === 0) {
        return this.$message.error("临床诊断必填！");
      }
      this.$confirm("确认发送此处方?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = JSON.parse(JSON.stringify(this.adviceGroups));
          data = data.map(val => {
            console.log(val);
            val.items ? val.items.unshift(val.main) : (val.items = [val.main]);
            val.items = val.items.map(v => {
              let {
                medicineId,
                name,
                quantity,
                standard,
                unit,
                useCount,
                useUnit,
                id,
                source
              } = v;
              console.log(
                medicineId,
                name,
                quantity,
                standard,
                unit,
                useCount,
                useUnit,
                id,
                source
              );
              // 适量或自定义
              if (useUnit === "适量" || useUnit === "2") {
                useUnit = useUnit === "适量" ? "适量" : useCount;
                useCount = null;
              } else {
                useCount = Number(useCount);
                console.log(useCount);

                if (Number.isNaN(useCount)) {
                  throw { type: "error", msg: "单次剂量必须填合法数字！" };
                }
                if (!useCount) {
                  throw { type: "error", msg: "单次剂量为必填且不能为0！" };
                }
                var b = parseFloat(useCount).toFixed(4);
                useCount = b.substring(0, b.toString().length - 1);
                if (!useUnit) {
                  throw { type: "error", msg: "单次剂量单位为必填！" };
                }
              }
              if (typeof quantity !== "number") {
                throw { type: "error", msg: "总量必须填数字！" };
              }
              if (quantity < 0) {
                throw { type: "error", msg: "总量必须填正整数！" };
              }
              if (!quantity) {
                throw { type: "error", msg: "总量为必填且不能为0！" };
              }
              if (!unit) {
                throw { type: "error", msg: "总量单位为必填！" };
              }

              let temp = {
                medicineId,
                name,
                quantity,
                standard,
                unit,
                useCount,
                useUnit,
                id,
                source
              };
              if (!this.adviceId) {
                delete temp.id;
              }
              return temp;
            });
            let {
              period,
              rate,
              startTime,
              type,
              urgent,
              way,
              day,
              useRemark,
              useTime,
              items,
              id
            } = val;
            console.log(
              period,
              rate,
              startTime,
              type,
              urgent,
              way,
              day,
              useRemark,
              useTime,
              items,
              id
            );
            if (!way) {
              throw { type: "error", msg: "用法为必填！" };
            }
            if (!rate) {
              throw { type: "error", msg: "频率为必填！" };
            }
            let temp = {
              period,
              rate,
              startTime,
              type,
              urgent,
              way,
              day,
              useRemark,
              useTime,
              items,
              id
            };
            if (!this.adviceId) {
              delete temp.id;
            }
            return temp;
          });
          let param = {
            source: 2,
            diagnosis: this.dynamicTags.join(","),
            adviceGroups: data,
            id: this.adviceId,
            present: this.advice.present, //主诉
            history: this.advice.history, //现病史
            previous: this.advice.previous, //既往史
            respirationRate: this.advice.respirationRate, //呼吸率（次/分钟）
            pulseRate: this.advice.pulseRate, //脉搏（次/分钟）
            temperature: this.advice.temperature, //体温（°C）
            pressureHign: this.advice.pressureHign, //血压（高）（mmHg）
            pressureLow: this.advice.pressureLow, //血压（低）（mmHg）
            examination: this.advice.examination, //辅助检查
            remark: this.advice.remark, //体检说明
            advise: this.advice.advise //治疗建议
          };
          if (param.adviceGroups.length > 0) {
            param.adviceGroups.forEach(item => {
              // delete item.id
              if (item.items && item.items.length > 0) {
                item.items.forEach(i => {
                  delete i.id;
                });
              }
            });
          console.log(param, "=====");
          axios
            .fetch(
              "medicalServer",
              "/api/advice/" + this.elderId,
              param,
              "json"
            )
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "发送成功!"
                });
                this.$emit("detailId", res.data);
                this.$emit("showRes", res.data);
              }
            });
          } else {
            this.$message.warning('请添加处方内容!');
          }
        })
        .catch(err => {
          console.log(err);
          if (err.type && err.type === "error") {
            this.$message.error(err.msg);
          } else {
            this.$message({
              type: "info",
              message: "已取消发送"
            });
          }
        });
    },

    // 关闭弹出框
    handleClose() {
      this.$nextTick(() => {
        this.medicineVisile = false;
      });
    },
    // 药品选择从子组件中获取
    getMedicine(data) {
      console.log(data);
      let arr = data.map(val => {
        val.main = {
          medicineId: val.id ? val.id : "",
          name: val.fullName ? val.fullName : "",
          quantity: val.quantity ? val.quantity : "",
          source: val.source ? val.source : "",
          standard: val.standard ? val.standard : "",
          unit: val.unit ? val.unit : "支",
          useCount: val.useCount ? val.useCount : "",
          useUnit: val.useUnit || val.packageUnit
        };
        val.type = 1;
        val.isSelected = false;
        return val;
      });
      this.adviceGroups = [...this.adviceGroups, ...arr];
      console.log(this.adviceGroups);
    }
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
/deep/ .el-table .cell {
  padding: 0;
}
/deep/ .el-table .cell,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 0 !important;
}
</style>
